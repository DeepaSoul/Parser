import React from 'react';
import Chart from "react-apexcharts";
import ApexCharts from 'apexcharts'

export default class DataChart extends React.Component {
    constructor(props) {
        super(props);
        console.log(this.props)
        this.state = {
            series: this.props.data,
            options: {
                chart: {
                    type: 'area',
                    stacked: false,
                    height: 350,
                    zoom: {
                        type: 'x',
                        enabled: true,
                        autoScaleYaxis: true
                    },
                    toolbar: {
                        autoSelected: 'zoom'
                    }
                },
                dataLabels: {
                    enabled: false
                },
                markers: {
                    size: 0,
                },
                title: {
                    text: 'Meter Readings',
                    align: 'center'
                },
                fill: {
                    type: 'gradient',
                    gradient: {
                        shadeIntensity: 1,
                        inverseColors: false,
                        opacityFrom: 0.5,
                        opacityTo: 0,
                        stops: [0, 90, 100]
                    },
                },
                yaxis: {
                    // labels: {
                    //     formatter: function (val) {
                    //         return (val / 1000000).toFixed(0);
                    //     },
                    // },
                    title: {
                        text: 'Reading'
                    },
                },
                xaxis: {
                    type: 'datetime',
                },
                tooltip: {
                    shared: false,
                    // y: {
                    //     formatter: function (val) {
                    //         return (val / 1000000).toFixed(0)
                    //     }
                    // }
                }
            },
            selection: 'one_year',
        };
    }


    updateData(timeline) {
        this.setState({
            selection: timeline
        })

        switch (timeline) {
            case 'one_month':
                ApexCharts.exec(
                    'area-datetime',
                    'zoomX',
                    new Date('28 Jan 2013').getTime(),
                    new Date('27 Feb 2013').getTime()
                )
                break
            case 'six_months':
                ApexCharts.exec(
                    'area-datetime',
                    'zoomX',
                    new Date('27 Sep 2012').getTime(),
                    new Date('27 Feb 2013').getTime()
                )
                break
            case 'one_year':
                ApexCharts.exec(
                    'area-datetime',
                    'zoomX',
                    new Date('27 Feb 2012').getTime(),
                    new Date('27 Feb 2013').getTime()
                )
                break
            case 'ytd':
                ApexCharts.exec(
                    'area-datetime',
                    'zoomX',
                    new Date('01 Jan 2013').getTime(),
                    new Date('27 Feb 2013').getTime()
                )
                break
            case 'all':
                ApexCharts.exec(
                    'area-datetime',
                    'zoomX',
                    new Date('23 Jan 2012').getTime(),
                    new Date('27 Feb 2013').getTime()
                )
                break
            default:
        }
    }


    render() {
        return (


            <div id="chart">
                <div class="toolbar">
                    <button id="one_month"

                        onClick={() => this.updateData('one_month')} className={(this.state.selection === 'one_month' ? 'active' : '')}>
                        1M
</button>
&nbsp;
<button id="six_months"

                        onClick={() => this.updateData('six_months')} className={(this.state.selection === 'six_months' ? 'active' : '')}>
                        6M
</button>
&nbsp;
<button id="one_year"


                        onClick={() => this.updateData('one_year')} className={(this.state.selection === 'one_year' ? 'active' : '')}>
                        1Y
</button>
&nbsp;
<button id="ytd"

                        onClick={() => this.updateData('ytd')} className={(this.state.selection === 'ytd' ? 'active' : '')}>
                        YTD
</button>
&nbsp;
<button id="all"

                        onClick={() => this.updateData('all')} className={(this.state.selection === 'all' ? 'active' : '')}>
                        ALL
</button>
                </div>

                <div id="chart-timeline">
                    <Chart options={this.state.options} series={this.state.series} type="area" height={350} />
                </div>
            </div>
        );
    }
}