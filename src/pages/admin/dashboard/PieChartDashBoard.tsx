import { useLayoutEffect } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5percent from "@amcharts/amcharts5/percent";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

interface ChartData {
  label: string;
  value: number;
}

interface PieChartDashBoardProps {
  data: ChartData[];
}

export default function PieChartDashBoard({ data }: PieChartDashBoardProps) {
  useLayoutEffect(() => {
    // Filter out data with value 0%
    const filteredData = data.filter((item) => item.value > 0);

    let root = am5.Root.new("chartdiv1");

    root.setThemes([am5themes_Animated.new(root)]);

    let chart = root.container.children.push(
      am5percent.PieChart.new(root, {
        layout: root.verticalLayout,
      })
    );

    let series = chart.series.push(
      am5percent.PieSeries.new(root, {
        valueField: "value",
        categoryField: "label",
      })
    );

    series.data.setAll(filteredData);

    series.labels.template.setAll({
      textType: "circular",
      radius: 5,
      text: "{category}",
    });

    var legend = chart.children.push(
      am5.Legend.new(root, {
        centerX: am5.percent(50),
        x: am5.percent(50),
        marginTop: 15,
        marginBottom: 15,
      })
    );

    legend.labels.template.setAll({
      text: "{category}: {value.percent.formatNumber('#.0')}%",
    });

    legend.data.setAll(series.dataItems);
    series.appear(1000, 100);

    return () => {
      root.dispose();
    };
  }, [data]);

  return <div id="chartdiv1" style={{ width: "100%", height: "400px" }}></div>;
}
