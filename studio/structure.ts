import { StructureBuilder } from "sanity/structure";
import { FaHouseUser } from "react-icons/fa";
import { BsCalendarEventFill, BsGearFill, BsMegaphone } from "react-icons/bs";
import { BsGraphUp } from "react-icons/bs";
import Dashboard from "./components/Dashboard";

const groups = [
  {
    name: 'Users',
    icon: FaHouseUser,
    menuGroups: [
      ['user'],
    ]
  },
  {
    name: 'Events',
    icon: BsCalendarEventFill,
    menuGroups: [
      ['occurrence'],
      ['eventType']
    ]
  },
  {
    name: 'Payments',
    icon: BsGraphUp,
    menuGroups: [
      ['paymentEvent']
    ]
  },
  {
    name: 'Marketing',
    icon: BsMegaphone,
    menuGroups: [
      ['landingPage'],
    ]
  },
  {
    name: 'System (auth internals)',
    icon: BsGearFill,
    menuGroups: [
      ['account', 'verificationToken'],
    ]
  },
];

export const structure = (S: StructureBuilder) =>
  S.list()
    .title('Main menu')
    .items([
      S.listItem()
        .title('Dashboard')
        .icon(BsGraphUp)
        .child(
          S.component(Dashboard)
            .title('Dashboard')
        ),
      S.divider(),
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
