import { defineField, defineType } from 'sanity';
import { GrUserFemale } from "react-icons/gr";
import { v4 as uuidv4 } from 'uuid';
import { nanoid } from 'nanoid';

export default defineType({
  title: "Event Attendants",
  name: "eventAttendant",
  type: "object",
  icon: GrUserFemale,
  fields: [
    defineField({
      title: "Full Name",
      name: "fullName",
      type: "string",
      validation: (rule) => {
        return rule.required();
      }
    }),
    defineField({
      title: "Email",
      name: "email",
      type: "email",
      validation: (rule) => {
        return rule.required();
      }
    }),
    defineField({
      title: "Phone",
      name: "phone",
      type: "string"
    }),
    defineField({
      title: "Subcribition Date",
      name: "subcribitionDate",
      type: "datetime",
      initialValue: (new Date()).toISOString()
    }),
    defineField({
      name: "uuid",
      type: "string",
      readOnly: true,
      initialValue: () => nanoid(8)
    }),
  ]
});