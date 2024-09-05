import { Occurrence } from '@/types/sanity.types';
import { getEventList, getEventSingle, updateEvent } from '../actions';
import { sanityClient } from '../sanity';
import { OccurrenceList, OccurrenceSingle } from '@/types/sanity.extended.types';
import { revalidateTag } from 'next/cache';

jest.mock('../sanity');

jest.mock('next/cache', () => ({
  revalidateTag: jest.fn(),
}));

describe('Actions', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getEventList', () => {
    it('should fetch event list', async () => {
      const mockData: OccurrenceList[] = [{
        "startDate": "2024-08-14T15:37:00+02:00",
        "endDate": "2024-08-15T04:31:00+02:00",
        "publicationStartDate": "2024-08-13T14:30:00+02:00",
        "numAttendants": 1,
        "_id": "13b54393-fe75-42cf-a301-c7ccf57c497c",
        "title": "Where are you going?",
        "slug": {
          "current": "where-can-i-get-some",
          "_type": "slug"
        }
      },
      {
        "numAttendants": 0,
        "_id": "66cbd98c-4725-457f-b702-4a32c79cfc3b",
        "title": "The standard Lorem Ipsum passage, used since the 1500s",
        "slug": {
          "current": "the-standard-lorem-ipsum",
          "_type": "slug"
        },
        "startDate": "2024-08-09T13:31:00.000Z",
        "endDate": "2024-08-17T13:31:00.000Z",
        "publicationStartDate": "2024-08-08T13:31:00.000Z"
      }
      ];
      (sanityClient.fetch as jest.Mock).mockResolvedValue(mockData);

      const createdBy = 'user1';
      const active = true;
      const result = await getEventList({ createdBy, active });

      expect(sanityClient.fetch).toHaveBeenCalledWith(expect.anything(), { createdBy, active });
      expect(result).toEqual(mockData);
    });

    it('should default active to true if not provided', async () => {
      const mockData: OccurrenceList[] = [];
      (sanityClient.fetch as jest.Mock).mockResolvedValue(mockData);

      const createdBy = 'user1';
      const result = await getEventList({ createdBy });

      expect(sanityClient.fetch).toHaveBeenCalledWith(expect.anything(), { createdBy, active: true });
      expect(result).toEqual(mockData);
    });
  });

  describe('getEventSingle', () => {
    it('should fetch single event', async () => {
      const mockData: OccurrenceSingle = {
        "location": "Anywhere you want bis",
        "description": "History, Purpose and Usage\nLorem ipsum, or lipsum as it is sometimes known, is dummy text used in laying out print, graphic or web designs. The passage is attributed to an unknown typesetter in the 15th century who is thought to have scrambled parts of Cicero's De Finibus Bonorum et Malorum for use in a type specimen book. It usually begins with:\n\n“Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.”\n\nThe purpose of lorem ipsum is to create a natural looking block of text (sentence, paragraph, page, etc.) that doesn't distract from the layout. A practice not without controversy, laying out pages with meaningless filler text can be very useful when the focus is meant to be on design, not content.",
        "pageImage": {
          "url": "https://cdn.sanity.io/images/htvid2fj/production/03ed75e362de0db0ff6d0b28334adc058670b8ea-512x512.png",
          "dimensions": {
            "_type": "sanity.imageDimensions",
            "width": 512,
            "aspectRatio": 1,
            "height": 512
          }
        },
        "endDate": "2024-08-15T04:31:00+02:00",
        "active": true,
        "subcribers": [
          {
            "fullName": "Sue Hellen",
            "email": "sue@gmail.com"
          }
        ],
        "title": "Where are you going?",
        "maxSubscribers": 11,
        "basicPrice": 127.5,
        "currency": "EUR",
        "_id": "13b54393-fe75-42cf-a301-c7ccf57c497c",
        "startDate": "2024-08-14T15:37:00+02:00",
        "publicationStartDate": "2024-08-13T14:30:00+02:00"
      };
      (sanityClient.fetch as jest.Mock).mockResolvedValue(mockData);

      const createdBy = 'user1';
      const slug = 'event-1';
      const result = await getEventSingle({ createdBy, slug });

      expect(sanityClient.fetch).toHaveBeenCalledWith(expect.anything(), { createdBy, slug }, { next: { tags: ['eventSingle'] } });
      expect(result).toEqual(mockData);
    });
  });

  describe('updateEvent', () => {
    it('should update event and revalidate tag', async () => {
      const mockData = { _id: '1', title: 'Updated Event' };
      (sanityClient.patch as jest.Mock).mockReturnValue({
        set: jest.fn().mockReturnThis(),
        commit: jest.fn().mockResolvedValue(mockData),
      });

      const id = '1';
      const data: Partial<Occurrence> = { title: 'Updated Event' };
      const result = await updateEvent({ id, data });

      expect(sanityClient.patch).toHaveBeenCalledWith(id);
      expect(sanityClient.patch(id).set).toHaveBeenCalledWith(data);
      expect(sanityClient.patch(id).commit).toHaveBeenCalled();
      expect(revalidateTag).toHaveBeenCalledWith('eventSingle');
      expect(result).toEqual(mockData);
    });
  });

});