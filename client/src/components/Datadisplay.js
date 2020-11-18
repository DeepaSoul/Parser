import React, { Component } from 'react';
import Table from './Table';
import DataChart from './Chart';

export default class DataDisaply extends Component {

    state = {
        serials: undefined,
        originalData: [],
        data: [],
        searchedData: [],
        serialList: [],
        search: undefined,
        loading: true,
        mode: 'ready'
    }

    componentDidMount = () => {
        this.getData()
    }

    getData = () => {
        fetch("http://localhost:5000/api/v4/readings")
            .then((res) => res.json())
            .then((data) => {
                console.log(data)
                this.setState({ originalData: data.data, data: data.data, serials: data.serials, loading: false })
            })
            .catch((err) => { console.log(err) })
    }

    search = (e) => {
        var list = []
        var serials = this.state.serials.split(";")

        if (e.target.value === "") {
            this.setState({
                serialList: [],
                searchedData: []
            })
            return;
        }

        for (var serial of serials) {
            if (serial.toString().toLowerCase().includes(e.target.value.toString().toLowerCase())) {
                list.push(serial)
            }
        }

        this.setState({
            serialList: list
        })
    }

    onFileUpload = (event) => {
        event.preventDefault();
        let file;

        if (event.target.files) file = event.target.files[0];
        if (event.dataTransfer) file = event.dataTransfer.files[0];

        const reader = new FileReader();
        reader.onload = (fileData) => this.parseCSVText(fileData.target.result.toString())
        reader.readAsText(file);
    };

    parseCSVText(rawtext) {
        const lines = rawtext.split('\r\n')
        const parsedData = [];
        for (const i in lines) {
            if ((lines[i]) && (parseInt(i, 10) > 0)) {
                let data = lines[i].split(';');
                if (data.length !== 4) {
                    data = lines[i].split(',');
                }

                parsedData.push({
                    Serial: data[0],
                    ReadingDateTimeUTC: data[1],
                    WH: data[2],
                    VARH: data[3]
                })
            }
        }
        this.setState({ importData: parsedData, mode: 'uploaded' })
    }

    openChart = (serial) => {
        var dataList1 = []
        var dataList = []
        for (var Data of this.state.originalData) {
            if (Data.Serial === serial) {
                var dateSplit = Data.ReadingDateTimeUTC.split("/")
                dataList1.push([new Date(`${dateSplit[1]}/${dateSplit[0]}/${dateSplit[2]}`).getTime(), parseInt(Data.WH)])
                dataList.push([new Date(`${dateSplit[1]}/${dateSplit[0]}/${dateSplit[2]}`).getTime(), parseInt(Data.VARH)])
            }
        }

        this.setState({
            searchedData: [
                { name: "WH", data: dataList1 },
                { name: "VARH", data: dataList }
            ]
        })
    }

    sendNewDataBackEnd = () => {
        this.setState({ loading: true })
        fetch("http://localhost:5000/api/v4/readings",  {
            method: 'POST',
            headers: {
              'content-type': 'application/json',
            },
            body: JSON.stringify({
                newData: this.state.importData
            }),
            credentials: 'omit'
          })
            .then((res) => res.json())
            .then((data) => {
                this.setState({ mode: 'ready',  originalData: data.data, data: data.data, serials: data.serials, loading: false})
            })
            .catch((err) => { console.log(err) })
    }

    render() {
        return (
            <div className="table-container" >
                <div class='table-container__title'>Metered Readings</div>
                <input
                    type="text"
                    placeholder={"Search"}
                    width={100}
                    height={50}
                    onChange={this.search}
                    style={{
                        margin: "auto",
                        marginTop: 20,
                        marginBottom: 20,
                        border: "1px solid #e3e1e1",
                        borderRadius: "6px",
                        fontSize: 13,
                        padding: 5
                    }}>
                </input>
                {(this.state.mode === 'ready') &&
                    <div
                        onDragEnter={(e) => {
                            e.preventDefault();
                        }}
                        onDragOver={(e) => { e.preventDefault() }}
                        onDragLeave={(e) => {
                            e.preventDefault();
                        }}
                        onDrop={this.onFileUpload}
                    >
                        Drag and Drop .csv file here or use the button below.<br />
                        <input type='file' accept='.csv' onChange={this.onFileUpload} multiple={false} />
                    </div>
                }
                {(this.state.mode === 'uploaded') &&
                    <div onClick={this.sendNewDataBackEnd} className="csvExportButton">
                        <p>Send</p>
                    </div>
                }
                {this.state.serialList.length > 0 && this.state.searchedData.length <= 0 &&
                    this.state.serialList.map((serial, index) => {
                        return <div onClick={() => this.openChart(serial)} key={index} class='table-container__title title_Padding'>{serial}</div>
                    })
                }
                {this.state.data.length > 0 && this.state.searchedData.length <= 0 &&
                    <Table
                        tableData={this.state.data}
                        headingColumns={['Serial', 'Date', 'WH Reading', 'VARH Reading']}
                        breakOn="medium"
                    />
                }
                { this.state.searchedData.length > 0 && <DataChart data={this.state.searchedData} />}
                {this.state.loading &&
                    <div className="loader"></div>
                }
            </div>
        )
    }
}