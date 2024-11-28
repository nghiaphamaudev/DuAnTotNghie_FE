import { useLayoutEffect } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

// Định nghĩa kiểu dữ liệu
interface ChartData {
  label: string;
  value: number;
}

interface ColumnChartDashBoardProps {
  data: ChartData[];
}

export default function ColumChartDashBoard({
  data,
}: ColumnChartDashBoardProps) {
  useLayoutEffect(() => {
    let root = am5.Root.new("chartdiv");

    root.setThemes([am5themes_Animated.new(root)]);

    let chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        layout: root.verticalLayout,
      })
    );

    // Tạo trục X (CategoryAxis)
    let xAxis = chart.xAxes.push(
      am5xy.CategoryAxis.new(root, {
        categoryField: "label",
        renderer: am5xy.AxisRendererX.new(root, {}),
      })
    );

    // Tạo trục Y (ValueAxis)
    let yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        renderer: am5xy.AxisRendererY.new(root, {}),
      })
    );

    // Tạo series cột
    let series = chart.series.push(
      am5xy.ColumnSeries.new(root, {
        name: "Series 1",
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: "value",
        categoryXField: "label",
        clustered: false,
      })
    );

    series.columns.template.setAll({
      tooltipText: "{categoryX}: {valueY}",
      width: am5.percent(60),
      
    });

    series.data.setAll(data);

    // Đặt dữ liệu cho trục X
    xAxis.data.setAll(data);

    // Tạo legend (chú thích)
    let legend = chart.children.push(am5.Legend.new(root, {}));
    legend.data.setAll(chart.series.values);
    legend.labels.template.setAll({
      fontSize: "12px",
    });
    series.appear(1000);

    return () => {
      root.dispose();
    };
  }, [data]);

  return <div id="chartdiv" style={{ width: "100%", height: "400px" }}></div>;
}
