import { useState, useRef } from "react";
import { AgGridReact } from 'ag-grid-react';
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-material.css"; //voi olla quartz, material tai design
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import DeleteIcon from '@mui/icons-material/Delete';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';


function TodoList() {

    const [todo, setTodo] = useState({
        description: "",
        date: dayjs(Date.now()),
        priority: ""
    });

    const [todos, setTodos] = useState([]);

    //luo uuden tyhjän referenssi olio ja tallennetaan se gridRef
    const gridRef = useRef();

    const [colDefs, setColDefs] = useState([
        {
            field: "description",
            filter: true,
            editable: true,
            floatingFilter: true
        },
        {
            field: "priority",
            cellStyle: params => params.value === "High" ? { color: 'red' } : { color: 'black' },
            filter: true,
            floatingFilter: true
        },
        {
            field: "date",
            filter: true,
            floatingFilter: true,
            valueFormatter: (params) => params.value ? params.value.format("DD/MM/YYYY") : ""
        }
    ]);

    const handleDelete = () => {
        if (gridRef.current.getSelectedNodes().length > 0) {
            setTodos(todos.filter((todo, index) =>
                index != gridRef.current.getSelectedNodes()[0].id));
        } else {
            alert("Select row first!");
        }
    }

    const handleAdd = () => {

        if (!todo.description.trim()) {
            alert("Type description first!")
        } else {
            setTodos([todo, ...todos]);
            //kun halutaan asettaa arvot tyhjiksi
            setTodo({ description: "", date: dayjs(Date.now()), priority: "" });
        }
    }

    return (
        <>

            <Stack mt={2} direction="row" spacing={2} justifyContent="center" alignItems="center">
                <TextField
                    label="Description"
                    value={todo.description}
                    onChange={event => setTodo({ ...todo, description: event.target.value })}
                />
                <FormControl sx={{ minWidth: 120 }}>
                    <InputLabel id="priority">Priority</InputLabel>
                    <Select
                        labelId="priority"
                        value={todo.priority}
                        label="Priority"
                        onChange={event => setTodo({ ...todo, priority: event.target.value })}
                    >
                        <MenuItem value={"Low"}>Low</MenuItem>
                        <MenuItem value={"Medium"}>Medium</MenuItem>
                        <MenuItem value={"High"}>High</MenuItem>
                    </Select>
                </FormControl>
                {/* <TextField
                    label="Priority"
                    value={todo.priority}
                    onChange={event => setTodo({ ...todo, priority: event.target.value })}
                /> */}
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                        label="Date"
                        defaultValue={dayjs(Date.now())}
                        value={dayjs(todo.date)}
                        onChange={(newValue) => setTodo({ ...todo, date: newValue })}
                    />
                </LocalizationProvider>
                <Button variant="contained" onClick={handleAdd}>Add Todo</Button>
                <Button variant="contained" endIcon={<DeleteIcon />} color="error" onClick={handleDelete}>Delete</Button>
            </Stack >
            <div className="ag-theme-material"
                style={{ height: 500, width: "100%" }}>
                <AgGridReact
                    rowData={todos}
                    columnDefs={colDefs}
                    selection="singleRow"
                    ref={gridRef}
                    onGridReady={params => gridRef.current = params.api}
                />
            </div>
        </>
    );
}

export default TodoList;
