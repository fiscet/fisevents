import { StructureBuilder } from "sanity/structure";
import { FaHouseUser } from "react-icons/fa";
import { BsCalendarEventFill, BsGearFill, BsMegaphone, BsGraphUp } from "react-icons/bs";
import { GrUserFemale } from "react-icons/gr";
import Dashboard from "./components/Dashboard";

export const structure = (S: StructureBuilder) =>
  S.list()
    .title('Main menu')
    .items([
      S.listItem()
        .title('Dashboard')
        .icon(BsGraphUp)
        .child(S.component(Dashboard).title('Dashboard')),

      S.divider(),

      // Single-type sections go straight to their document list (no extra submenu)
      S.documentTypeListItem('user').title('Users').icon(FaHouseUser),

      S.divider(),

      // Events: pick an event, then edit it or view its registrations
      S.listItem()
        .title('Events')
        .icon(BsCalendarEventFill)
        .child(
          S.list()
            .title('Events')
            .items([
              S.listItem()
                .title('Events')
                .icon(BsCalendarEventFill)
                .child(
                  S.documentTypeList('occurrence')
                    .title('Events')
                    .child((occurrenceId) =>
                      S.list()
                        .title('Event')
                        .items([
                          S.listItem()
                            .title('Edit event')
                            .icon(BsCalendarEventFill)
                            .child(
                              S.document()
                                .documentId(occurrenceId)
                                .schemaType('occurrence')
                            ),
                          S.listItem()
                            .title('Registrations')
                            .icon(GrUserFemale)
                            .child(
                              S.documentList()
                                .title('Registrations')
                                .schemaType('registration')
                                .filter(
                                  '_type == "registration" && occurrence._ref == $occurrenceId'
                                )
                                .params({ occurrenceId })
                            ),
                        ])
                    )
                ),
              S.documentTypeListItem('eventType').title('Event Types'),
            ])
        ),

      S.divider(),

      S.documentTypeListItem('paymentEvent').title('Payments').icon(BsGraphUp),

      S.divider(),

      S.documentTypeListItem('landingPage').title('Marketing').icon(BsMegaphone),

      S.divider(),

      // Multi-type section keeps a submenu
      S.listItem()
        .title('System (auth internals)')
        .icon(BsGearFill)
        .child(
          S.list()
            .title('System')
            .items([
              S.documentTypeListItem('account').title('Accounts'),
              S.documentTypeListItem('verificationToken').title('Verification Tokens'),
            ])
        ),
    ]);
