import * as React from "react";
// import { Button, ButtonType } from "office-ui-fabric-react";
// import Header from "./Header";
import /*HeroList,*/ { HeroListItem } from "./HeroList";
import Progress from "./Progress";
/* global Button, console, Excel, Header, HeroList, HeroListItem, Progress */

import * as Charticulator from "../../../charticulator-container/container/index";
import * as empty_template from "./../../../assets/empty_template.json";
// const empty_template = require("./../../../assets/empty_template.json");

export interface AppProps {
  title: string;
  isOfficeInitialized: boolean;
}

export interface AppState {
  listItems: HeroListItem[];
  charticulatorInitialized: boolean;
  error: string;
}

export default class App extends React.Component<AppProps, AppState> {
  constructor(props, context) {
    super(props, context);
    this.state = {
      listItems: [],
      charticulatorInitialized: false,
      error: null
    };
  }

  componentDidMount() {
    this.setState({
      listItems: [
        {
          icon: "Ribbon",
          primaryText: "Achieve more with Office integration"
        },
        {
          icon: "Unlock",
          primaryText: "Unlock features and functionality"
        },
        {
          icon: "Design",
          primaryText: "Create and visualize like a pro"
        }
      ]
    });

    Charticulator.initialize().then(() => {
      this.setState({
        charticulatorInitialized: true
      });

    })
  }

  click = async () => {
    try {
      await Excel.run(async context => {
        /**
         * Insert your Excel code here
         */
        const range = context.workbook.getSelectedRange();

        // Read the range address
        range.load("address");

        // Update the fill color
        range.format.fill.color = "yellow";

        await context.sync();
        console.log(`The range address was ${range.address}.`);
      });
    } catch (error) {
      console.error(error);
    }
  };

  render() {
    const { title, isOfficeInitialized } = this.props;

    if (!isOfficeInitialized) {
      return (
        <Progress title={title} logo="assets/logo-filled.png" message="Please sideload your addin to see app body." />
      );
    }

    if (this.state.error !== null) {
      return <div id="container"><p>{this.state.error}</p></div>;
    }

    if (this.state.charticulatorInitialized) {
      try{
        const template: Charticulator.Specification.Template.ChartTemplate = empty_template as any;
        const dataset: Charticulator.Dataset.Dataset = {
          name: "Dataset",
          "tables": [
            {
              "name": "Cities",
              "displayName": "Cities",
              "columns": [
                {
                  "name": "ID",
                  "displayName": "ID",
                  "type": Charticulator.Specification.DataType.String,
                  "metadata": {
                    "kind": Charticulator.Specification.DataKind.Categorical,
                    "orderMode": "alphabetically"
                  }
                },
                {
                  "name": "Cities",
                  "displayName": "Cities",
                  "type": Charticulator.Specification.DataType.String,
                  "metadata": {
                    "kind": Charticulator.Specification.DataKind.Categorical,
                    "orderMode": "alphabetically"
                  }
                },
                {
                  "name": "Country",
                  "displayName": "Country",
                  "type": Charticulator.Specification.DataType.String,
                  "metadata": {
                    "kind": Charticulator.Specification.DataKind.Categorical,
                    "orderMode": "alphabetically"
                  }
                },
                {
                  "name": "Value",
                  "displayName": "Value",
                  "type": Charticulator.Specification.DataType.Number,
                  "metadata": {
                    "kind": Charticulator.Specification.DataKind.Numerical
                  }
                }
              ],
              "rows": [
                {
                  "_id": "0",
                  "ID": "RU",
                  "Cities": "Moscow",
                  "Country": "Russia",
                  "Value": 23
                },
                {
                  "_id": "1",
                  "ID": "RU",
                  "Cities": "Kazan",
                  "Country": "Russia",
                  "Value": 43
                },
                {
                  "_id": "2",
                  "ID": "RU",
                  "Cities": "Sochi",
                  "Country": "Russia",
                  "Value": 22
                },
                {
                  "_id": "3",
                  "ID": "GE",
                  "Cities": "Berlin",
                  "Country": "Germany",
                  "Value": 34
                },
                {
                  "_id": "4",
                  "ID": "GE",
                  "Cities": "Frankfurt",
                  "Country": "Germany",
                  "Value": 30
                },
                {
                  "_id": "5",
                  "ID": "GE",
                  "Cities": "Cologne",
                  "Country": "Germany",
                  "Value": 18
                },
                {
                  "_id": "6",
                  "ID": "US",
                  "Cities": "Tacoma",
                  "Country": "USA",
                  "Value": 15
                },
                {
                  "_id": "7",
                  "ID": "US",
                  "Cities": "Seattle",
                  "Country": "USA",
                  "Value": 41
                },
                {
                  "_id": "8",
                  "ID": "US",
                  "Cities": "Bellevue",
                  "Country": "USA",
                  "Value": 33
                }
              ],
              "type": Charticulator.Dataset.TableType.Main
            }
          ]
        }
        const chartTemplate = new Charticulator.ChartTemplate(
          template
        );
        chartTemplate.assignTable(
          dataset.tables[0].name,
          dataset.tables[0].name
        );
        const instance = chartTemplate.instantiate(dataset);
        const container = new Charticulator.ChartContainer(instance, dataset);
        // // const width = document.getElementById("container").getBoundingClientRect().width;
        // // const height = document.getElementById("container").getBoundingClientRect().height;
        container.mount("container", 400, 400);
      }
      catch(ex) {
        this.setState({
          error: JSON.stringify(ex)
        });
      }
    }

    return <div id="container"><p>Charticulator container</p></div>;

    // return (
    //   <div className="ms-welcome">
    //     <Header logo="assets/logo-filled.png" title={this.props.title} message="Welcome" />
    //     <HeroList message="Discover what Office Add-ins can do for you today!" items={this.state.listItems}>
    //       <p className="ms-font-l">
    //         {this.state.charticulatorInitialized ? "Charticulator initialized": ""}
    //       </p>
    //       <p className="ms-font-l">
    //         Modify the source files, then click <b>Run</b>.
    //       </p>
    //       <Button
    //         className="ms-welcome__action"
    //         buttonType={ButtonType.hero}
    //         iconProps={{ iconName: "ChevronRight" }}
    //         onClick={this.click}
    //       >
    //         Run
    //       </Button>
    //     </HeroList>
    //   </div>
    // );
  }
}
