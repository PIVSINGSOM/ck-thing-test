import { Component, Fragment, useState } from 'react'
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';

import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, DatePicker, TimePicker } from "@material-ui/pickers";
import axios from 'axios'
import moment from 'moment'



import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import TablePagination from '@material-ui/core/TablePagination';


const BASE_URL = 'https://60192763640f2a001778f6c1.mockapi.io/api/v1/';


class Materail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedDate: null,
            selectedtime: null,
            list_data: [],
            data_table: [],
            loading: false,
            textKeyword: null,
            page: 0,
            perPage: 5
        };
    }

    async onDateChange(date) {
        await this.setState({ selectedDate: date })
        this.filterData()
    }

    async onTimeChange(time) {
        await this.setState({ selectedtime: time })
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

    handleChangeRowsPerPage(event) {
        this.setState({ perPage: parseInt(event.target.value, 10) });
        this.setState({ page: 0 });
    };

    componentDidMount() {
        this.getDataApi()
    }

    filterData(event) {
        const { selectedDate, list_data, selectedtime } = this.state
        let date = moment(selectedDate).format('DD-MM-YYYY')
        let data = list_data

        if (selectedDate) {
            data = data.filter(el => {
                return moment(el.createdAt).format('DD-MM-YYYY') == date
            })
        }

        if (selectedtime) {
            data = data.filter(el => {
                let time = moment(el.createdAt).format('H:mm')
                let select_time = moment(selectedtime).format('H:mm')
                console.log(time, select_time)
                return time == select_time
            })
        }

        if (event) {
            console.log('event', event)
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



    render() {
        const { selectedDate, selectedtime, data_table, page, perPage } = this.state

        const emptyRows = perPage - Math.min(perPage, data_table.length - page * perPage);


        return (
            <Fragment>


                <Grid container justify="flex-start">

                    <TextField id="Keyword" label="Keyword" style={{ marginRight: '1rem' }} onChange={(event) => this.filterData(event)} />
                    <MuiPickersUtilsProvider utils={DateFnsUtils}  >
                        <DatePicker
                            label="Date picker"
                            value={selectedDate}
                            onChange={(date) => this.onDateChange(date)}
                            animateYearScrolling
                            style={{ marginRight: '1rem' }}
                        />
                        <TimePicker
                            clearable
                            ampm={false}
                            label="Time Picker"
                            value={selectedtime}
                            onChange={(time) => this.onTimeChange(time)}
                            style={{ marginRight: '1rem' }}

                        />
                    </MuiPickersUtilsProvider>




                    <Button variant="contained" color="warning"> clear filter </Button>

                </Grid>


                <TableContainer component={Paper} style={{ marginTop: '2rem' }}>
                    <Table aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell align="left">ID</TableCell>
                                <TableCell align="left">Name</TableCell>
                                <TableCell align="left">Create at</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data_table
                                .slice(page * perPage, page * perPage + perPage)
                                .map((row) => (
                                    <TableRow key={row.id}>
                                        <TableCell align="left">{row.id}</TableCell>
                                        <TableCell align="left">{row.name}</TableCell>
                                        <TableCell align="left">{row.createdAt_convert}</TableCell>
                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={data_table.length}
                        rowsPerPage={perPage}
                        page={page}
                        onChangePage={(event, newPage) => this.setState({ page: newPage })}
                        onChangeRowsPerPage={(event) => this.handleChangeRowsPerPage(event)}
                    />
                </TableContainer>


            </Fragment>
        );
    }
}

export default Materail;