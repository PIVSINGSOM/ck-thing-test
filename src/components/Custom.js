import { Component, Fragment, useState } from 'react'

import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import TimePicker from 'react-time-picker'
// import TimePicker from 'react-time-picker/dist/entry.nostyle'; 
import TimeKeeper from 'react-timekeeper';
import DataTable from 'react-data-table-component';
import axios from 'axios'

import moment from 'moment'


const columns = [
    {
        name: 'ID',
        selector: 'id',
        sortable: true,
    },
    {
        name: 'Name',
        selector: 'name',
        sortable: true,
        right: false,
    },
    {
        name: 'Create At',
        selector: 'createdAt_convert',
        sortable: true,
        right: false,
    },
];


const BASE_URL = 'https://60192763640f2a001778f6c1.mockapi.io/api/v1/';



const ExpendComponent = ({ data }) => {

    return (
        <div class="row">
            <div class="col-md-3">
                <p>Name : {data.name}</p>
            </div>
            <div class="col-md-3">
                <p>Create at : {data.createdAt}</p>
            </div>
            <div class="col-md-3">
                <p>Image : <a href={data.avatar} target="blank">click</a></p>
            </div>
            {/* <pre>{JSON.stringify(data)}</pre> */}
        </div>
    )
}



class customTool extends Component {

    constructor(props) {
        super(props)

        this.state = {
            dateSelected: null,
            timeSelected: null,
            showTimePciker: false,
            list_data: [],
            data_table: [],
            loading: false,
            textKeyword: null
        }

    }

    async onTimeSelected(data) {
        await this.setState({ timeSelected: data.formatted24 })
        this.filterData()
    }

    async getDataApi() {
        this.setState({ loading: true })
        let response = await axios.get(`${BASE_URL}/post`)
        let list_data = response.data.map(el => {
            el.createdAt_convert = moment(el.createdAt).format('DD-MM-YYYY : H:mm')
            return el
        })
        this.setState({ list_data: list_data })
        this.setState({ data_table: list_data })
        this.setState({ loading: false })

    }


    dataInput(event) {
        let text = event.target.value
        this.setState({ textKeyword: text })
        const { list_data } = this.state
        let finded_data = list_data.filter((option) => {
            return option.name
                .toString()
                .toLowerCase()
                .indexOf(text.toLowerCase()) >= 0
        })
        this.setState({ data_table: finded_data })
    }

    async onDateChange(date) {
        await this.setState({ dateSelected: date })
        this.filterData()
    }

    filterData(event) {
        const { dateSelected, list_data, timeSelected } = this.state
        let date = moment(dateSelected).format('DD-MM-YYYY')
        let data = list_data

        if (dateSelected) {
            data = data.filter(el => {
                return moment(el.createdAt).format('DD-MM-YYYY') == date
            })
        }

        if (timeSelected) {
            data = data.filter(el => {
                let time = moment(el.createdAt).format('H:mm')
                console.log(time, timeSelected)
                return time == timeSelected
            })
        }

        if (event) {
            let text = event.target.value
            this.setState({ textKeyword: text })
            data = data.filter((option) => {
                return option.name
                    .toString()
                    .toLowerCase()
                    .indexOf(text.toLowerCase()) >= 0
            })
        }

        this.setState({ data_table: data })

    }

    async onClearFilter() {
        await this.setState({ timeSelected: null })
        await this.setState({ dateSelected: null })
        this.refs.keyword.value = '';
        this.filterData()

    }

    componentDidMount() {
        this.getDataApi()
    }



    render() {
        const { dateSelected, timeSelected, showTimePciker, data_table, loading } = this.state
        return (
            <Fragment>
                <div class="row" style={{ marginBottom: '10px' }}>
                    <div class="col-md-2">
                        <label class="form-label">Keyword</label>
                        <input
                            type="email"
                            class="form-control"
                            disabled={loading}
                            ref="keyword"
                            onChange={(event) => this.filterData(event)}
                            placeholder="search by name"
                        />
                    </div>
                    <div class="col-md-2">
                        <label class="form-label">Date Picker</label>
                        <DatePicker
                            selected={dateSelected}
                            locale="th"
                            onChange={date => this.onDateChange(date)}
                            className="form-control"
                            disabled={loading}
                        />
                    </div>
                    <div class="col-md-2">
                        <label class="form-label"> Time Picker </label>

                        {
                            !showTimePciker &&
                            <input
                                type="email"
                                class="form-control"
                                onClick={() => this.setState({ showTimePciker: true })}
                                value={timeSelected}
                                disabled={loading}
                            />

                        }

                        {
                            showTimePciker && <TimeKeeper
                                time={timeSelected}
                                onChange={(data) => this.onTimeSelected(data)}
                                className="mt-6"
                                hour24Mode
                                onDoneClick={() => this.setState({ showTimePciker: false })}
                            />
                        }

                    </div>

                    <div class="col-md-2">
                        <button
                            type="button"
                            class="btn btn-warning "
                            style={{ marginTop: '2rem' }}
                            onClick={() => this.onClearFilter()}
                            disabled={loading}
                        >Clear filter</button>
                    </div>

                </div>

                {/*  section table */}

                {
                    loading ?
                        <div class="text-center" style={{ marginTop: '5rem' }}>
                            <div class="spinner-border" role="status">
                                <span class="visually-hidden">Loading...</span>
                            </div>
                        </div>
                        :
                        <DataTable
                            style={{ marginTop: '3rem' }}
                            title="Data Table"
                            columns={columns}
                            data={data_table}
                            pagination
                            expandableRows
                            expandableRowsComponent={<ExpendComponent />}
                        />
                }

            </Fragment>

        )
    }


}


export default customTool