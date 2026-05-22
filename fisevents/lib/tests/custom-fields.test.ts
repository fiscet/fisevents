import {
  getCustomFieldKey,
  getCustomFieldsDefaults,
  buildCustomFieldsSchema,
  customFieldsValuesToArray,
  getAttendantCustomValue,
  type CustomFieldDefInput,
} from '../custom-fields';

const messages = {
  required: 'required',
  invalidNumber: 'invalid number',
};

describe('custom-fields', () => {
  describe('getCustomFieldKey', () => {
    it('prefers the explicit name', () => {
      expect(getCustomFieldKey({ name: 'shirt', label: 'Company name' })).toBe(
        'shirt'
      );
    });

    it('falls back to a slugified label when there is no name', () => {
      expect(getCustomFieldKey({ label: 'Company name' })).toBe('company-name');
    });

    it('falls back to _key when there is no name or label', () => {
      expect(getCustomFieldKey({ _key: 'abc123' })).toBe('abc123');
    });

    it('returns an empty string when nothing is available', () => {
      expect(getCustomFieldKey({})).toBe('');
    });
  });

  describe('getCustomFieldsDefaults', () => {
    const defs: CustomFieldDefInput[] = [
      { name: 'note', fieldType: 'text' },
      { name: 'qty', fieldType: 'number' },
      { name: 'meal', fieldType: 'select', options: ['veg', 'meat'] },
      { name: 'newsletter', fieldType: 'checkbox' },
    ];

    it('defaults text/number/select to empty string and checkbox to false', () => {
      expect(getCustomFieldsDefaults(defs)).toEqual({
        note: '',
        qty: '',
        meal: '',
        newsletter: false,
      });
    });

    it('seeds values from existing answers, coercing checkbox to boolean', () => {
      const existing = [
        { name: 'note', value: 'hello' },
        { name: 'newsletter', value: 'true' },
      ];
      const result = getCustomFieldsDefaults(defs, existing);
      expect(result.note).toBe('hello');
      expect(result.newsletter).toBe(true);
      expect(result.qty).toBe('');
    });

    it('treats a non-"true" checkbox value as false', () => {
      const result = getCustomFieldsDefaults(
        [{ name: 'newsletter', fieldType: 'checkbox' }],
        [{ name: 'newsletter', value: 'false' }]
      );
      expect(result.newsletter).toBe(false);
    });

    it('skips fields without a resolvable key', () => {
      expect(getCustomFieldsDefaults([{ fieldType: 'text' } as CustomFieldDefInput, {}])).toEqual(
        {}
      );
    });

    it('returns an empty object for no fields', () => {
      expect(getCustomFieldsDefaults(undefined)).toEqual({});
    });
  });

  describe('buildCustomFieldsSchema', () => {
    it('accepts an empty value set when there are no fields', () => {
      const schema = buildCustomFieldsSchema(undefined, messages);
      expect(schema.safeParse({}).success).toBe(true);
    });

    it('rejects an empty required text field but accepts content', () => {
      const schema = buildCustomFieldsSchema(
        [{ name: 'note', fieldType: 'text', required: true }],
        messages
      );
      const empty = schema.safeParse({ note: '   ' });
      expect(empty.success).toBe(false);
      if (!empty.success) {
        expect(empty.error.issues[0].message).toBe('required');
      }
      expect(schema.safeParse({ note: 'hi' }).success).toBe(true);
    });

    it('allows an empty optional text field', () => {
      const schema = buildCustomFieldsSchema(
        [{ name: 'note', fieldType: 'text' }],
        messages
      );
      expect(schema.safeParse({ note: '' }).success).toBe(true);
    });

    it('validates numeric input for number fields', () => {
      const schema = buildCustomFieldsSchema(
        [{ name: 'qty', fieldType: 'number' }],
        messages
      );
      expect(schema.safeParse({ qty: '12' }).success).toBe(true);
      expect(schema.safeParse({ qty: '' }).success).toBe(true);
      const bad = schema.safeParse({ qty: 'abc' });
      expect(bad.success).toBe(false);
      if (!bad.success) {
        expect(bad.error.issues[0].message).toBe('invalid number');
      }
    });

    it('requires a numeric value for required number fields', () => {
      const schema = buildCustomFieldsSchema(
        [{ name: 'qty', fieldType: 'number', required: true }],
        messages
      );
      expect(schema.safeParse({ qty: '' }).success).toBe(false);
      expect(schema.safeParse({ qty: '3' }).success).toBe(true);
    });

    it('requires a required checkbox to be true', () => {
      const schema = buildCustomFieldsSchema(
        [{ name: 'rules', fieldType: 'checkbox', required: true }],
        messages
      );
      expect(schema.safeParse({ rules: false }).success).toBe(false);
      expect(schema.safeParse({ rules: true }).success).toBe(true);
    });

    it('allows an optional checkbox to be either value', () => {
      const schema = buildCustomFieldsSchema(
        [{ name: 'news', fieldType: 'checkbox' }],
        messages
      );
      expect(schema.safeParse({ news: false }).success).toBe(true);
      expect(schema.safeParse({ news: true }).success).toBe(true);
    });
  });

  describe('customFieldsValuesToArray', () => {
    const defs: CustomFieldDefInput[] = [
      { name: 'note', label: 'Note', fieldType: 'text' },
      { name: 'news', label: 'Newsletter', fieldType: 'checkbox' },
    ];

    it('maps string values and serialises booleans', () => {
      const result = customFieldsValuesToArray(defs, {
        note: 'hello',
        news: true,
      });
      expect(result).toEqual([
        { name: 'note', label: 'Note', value: 'hello' },
        { name: 'news', label: 'Newsletter', value: 'true' },
      ]);
    });

    it('serialises a false checkbox to the string "false"', () => {
      const result = customFieldsValuesToArray(defs, { note: '', news: false });
      expect(result.find((v) => v.name === 'news')?.value).toBe('false');
    });

    it('uses the key as label fallback and handles missing values', () => {
      const result = customFieldsValuesToArray(
        [{ name: 'note', fieldType: 'text' }],
        {}
      );
      expect(result).toEqual([{ name: 'note', label: 'note', value: '' }]);
    });

    it('drops fields without a key', () => {
      const result = customFieldsValuesToArray([{ fieldType: 'text' }], {});
      expect(result).toEqual([]);
    });

    it('returns an empty array when there are no values', () => {
      expect(customFieldsValuesToArray(defs, undefined)).toEqual([]);
    });
  });

  describe('getAttendantCustomValue', () => {
    const def: CustomFieldDefInput = {
      name: 'note',
      label: 'Note',
      fieldType: 'text',
    };

    it('returns the answer matching the field name', () => {
      const attendant = {
        customFieldValues: [{ name: 'note', value: 'hello' }],
      };
      expect(getAttendantCustomValue(attendant, def)).toBe('hello');
    });

    it('returns an empty string when there is no matching answer', () => {
      expect(getAttendantCustomValue({ customFieldValues: [] }, def)).toBe('');
      expect(getAttendantCustomValue({}, def)).toBe('');
    });

    it('formats checkbox answers as a symbol', () => {
      const checkboxDef: CustomFieldDefInput = {
        name: 'news',
        fieldType: 'checkbox',
      };
      expect(
        getAttendantCustomValue(
          { customFieldValues: [{ name: 'news', value: 'true' }] },
          checkboxDef
        )
      ).toBe('✓');
      expect(
        getAttendantCustomValue(
          { customFieldValues: [{ name: 'news', value: 'false' }] },
          checkboxDef
        )
      ).toBe('—');
    });
  });
});
