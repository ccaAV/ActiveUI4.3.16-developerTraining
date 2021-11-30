// TODO: 5.1.1 create and export an action plugin with the below values:
// isAvailable: to return true
// getCaption: to return translation mapping showSingleValue
// getIconSrcKey: choose a suitable icon key from showcase > Built-in Widgets > Icons
// execute: use console.log to print out the object actionPayload
// set debugger in each property step before the function return
// refer to https://activeviam.com/activeui/documentation/4.3.16/dev/reference/plugins.html#implement-a-custom-action-plugin
import {ActionPayload, ActiveUI, TabularHandlerActionPayload, Container} from "@activeviam/activeui-sdk";
import {Modal} from "antd";
import React from "react";

const cityHierarchy = "[Geography].[City]";
const currencyHierarchy = "[Currency].[Currency]";

const getCityCurrencyFromPayload = (payload: any, activeUI: ActiveUI) => {

    // refer to showcase for location information extraction : https://activeviam.jfrog.io/activeviam/activeui-generic-release/4.3.16/activeui-sdk-showcase-4.3.16.zip!/index.html#/Extract%20Locations%20Information%20from%20Pivot%20Table
    const location = activeUI.data.getLocationsInfoFromPayload(payload, "all")[0];
    if(location === undefined) {
        return undefined;
    } else {
        const {captions :cityCaption } = location.members[cityHierarchy] || {};
        const {captions: currencyCaption} = location.members[currencyHierarchy] || {};
        if (cityCaption === undefined || currencyCaption === undefined) {
            return undefined;
        } else {
            return {cityCaption, currencyCaption};
        }
    }
}



function SingleValueContent(props: any) {
    const { mdx } = props;
    return (
        <div style={{ width: "100%", height: "120px" }}>
        </div>
    );
}


// TODO 5.3: use getSingleValueMdx to make use of the city and currency values
const getSingleValueMdx = (cellValue: any) => `
SELECT
NON EMPTY Hierarchize(
  Crossjoin(
    DrilldownLevel(
      [Currency].[Currency].[ALL].[AllMember]
    ),
    [Geography].[City].[City].Members
  )
) ON ROWS,
NON EMPTY [Measures].[pnl.SUM] ON COLUMNS,
{
  [Booking].[Desk].[ALL].[AllMember].[LegalEntityA].[BusinessUnitA].[DeskA],
  [Booking].[Desk].[ALL].[AllMember].[LegalEntityA].[BusinessUnitB].[DeskB]
} ON PAGES
FROM (
  SELECT
  [Geography].[City].[ALL].[AllMember].[${cellValue.cityCaption}] ON COLUMNS

FROM (
    SELECT
    [Currency].[Currency].[ALL].[AllMember].[${cellValue.currencyCaption}] ON COLUMNS
    FROM (
      SELECT
        [Measures].[pnl.SUM]
       ON COLUMNS
      FROM [EquityDerivativesCube]
    )
  )
)
CELL PROPERTIES VALUE, FORMATTED_VALUE, BACK_COLOR, FORE_COLOR, FONT_FLAGS`;


export const showSingleValue = {
    key: "show-single-value",
    createProperties(parameters: any, activeUI: ActiveUI) {
        return {
        isAvailable(actionPayload: ActionPayload) {
        const { actionSituation, widgetApi, context } = actionPayload as TabularHandlerActionPayload;
        const isWidgetTabular = actionSituation === "tabular-handler";
        const isWidgetNonStatic = widgetApi.getDataSource().usesMdx();
        const isCellSelected = context !== undefined;
        let cityAndCurrencyAvailable = getCityCurrencyFromPayload(actionPayload as ActionPayload, activeUI) !== undefined;


        return isWidgetTabular && isWidgetNonStatic && isCellSelected && cityAndCurrencyAvailable;

        },

        getCaption( actionPayload : ActionPayload) {
          debugger;
          return { textPath: "custom action" };
        },
        getIconSrcKey(actionPayload: ActionPayload) {
          debugger;
          return 'menuItem.icon.dockInLegend';
        },
        execute(event: React.SyntheticEvent, actionPayload: ActionPayload) {
            // TODO 5.3: use function created to obtain city and currency values

            debugger;
          console.log("actionPayload", actionPayload);
            //TODO: 5.3 display a modal with Hello World
        }
      };
    },
};