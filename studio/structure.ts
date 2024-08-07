import { StructureBuilder } from "sanity/structure";
import { FaHouseUser } from "react-icons/fa";
import { BsCalendarEventFill } from "react-icons/bs";

const groups = [
  {
    name: 'Auth & Users',
    icon: FaHouseUser,
    menuGroups: [
      ['user'],
      ['account', 'verificationToken'],
    ]
  },
  {
    name: 'Events',
    icon: BsCalendarEventFill,
    menuGroups: [
      ['event', 'eventAttendant'],
      ['eventType']
    ]
  }
];

export const structure = (S: StructureBuilder) =>
  S.list()
    .title('Main menu')
    .items([
      ...groups.map((group, i) => {
        return (
          S.listItem()
            .title(group.name)
            .icon(group.icon ?? null)
            .child(
              S.list()
                // Sets a title for our new list
                .title(group.name)
                // Add items to the array
                // Each will pull one of our new singletons
                .items(
                  group.menuGroups.flatMap(menuGroup =>
                    [S.divider(), ...menuGroup.map(sType => S.documentTypeListItem(sType).id(sType).schemaType(sType))])
                )));
      })
    ]);
