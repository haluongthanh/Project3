import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getLogs, selectAllLogs, resetMutationResult, selectLogMutationResult } from '../../../redux/features/logSlice';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import Pagination from '../../../utility/Pagination';
import BoxShadowLoader from '../../Skeletons/BoxShadowLoader';

import View from '@mui/icons-material/ViewAgenda';

const FilteredTable = () => {
    const dispatch = useDispatch();
    const { filteredLogsCount, resultPerPage, logs, loading } = useSelector(selectAllLogs);
    const {success, error } = useSelector(selectLogMutationResult);
    const [filters, setFilters] = useState({
        search: '',
        currentPage: 1,
        startDate: '',
        endDate: '',
        action: '',
        entityType: '',
    });

    useEffect(() => {
        if (success) {
            dispatch(selectLogMutationResult())
        }
        dispatch(getLogs({ ...filters, toast }));
    }, [filters, dispatch]);

    const handleFilterChange = (e) => {
        setFilters({
            ...filters,
            [e.target.name]: e.target.value
        });
    };

    const handlePageChange = (page) => {
        setFilters({
            ...filters,
            currentPage: page
        });
    };

    const totalPages = Math.ceil(filteredLogsCount / resultPerPage);

    if (logs==undefined||loading==undefined) {
        return <BoxShadowLoader/>
    }
    return (
        <div className="container mt-4">
            <h1 className="mb-4 text-center">Full List of Logs</h1>

            <div className="mb-3">
                <div className="row">
                    <div className="col-md-2">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Search"
                            name="search"
                            value={filters.search}
                            onChange={handleFilterChange}
                        />
                    </div>
                    <div className="col-md-2">
                        <input
                            type="date"
                            className="form-control"
                            placeholder="Start Date"
                            name="startDate"
                            value={filters.startDate}
                            onChange={handleFilterChange}
                        />
                    </div>
                    <div className="col-md-2">
                        <input
                            type="date"
                            className="form-control"
                            placeholder="End Date"
                            name="endDate"
                            value={filters.endDate}
                            onChange={handleFilterChange}
                        />
                    </div>

                    <div className="col-md-3">
                        <select
                            className="form-control"
                            name="action"
                            value={filters.action}
                            onChange={handleFilterChange}
                        >
                            <option value="">All Status</option>
                            <option value="CREATE">Create</option>
                            <option value="UPDATE">Update</option>
                            <option value="DELETE">Delete</option>
                            <option value="LOGIN">Login</option>
                            <option value="LOGOUT">Logout</option>

                        </select>
                    </div>
                    
                </div>
            </div>


            {logs.length === 0 ? (
                <div className="alert alert-info text-center" role="alert">
                    Logs not found.
                </div>
            ) : (
                <>
                    <div className='table-responsive'>

                        <table className="table table-bordered">
                            <thead>
                                <tr className="table-secondary">
                                    <th>ID</th>
                                    <th>title</th>
                                    <th>Entity Type</th>
                                    <th>Action</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {logs && logs.map(log => (
                                    <tr key={log._id}>
                                        <td>{log._id}</td>
                                        <td>{log.title}</td>
                                        <td>{log.entityType}</td>
                                        <td>{log.action}</td>
                                        <td>
                                            <Link to={`/authorized/log/${log._id}`} className="btn btn-primary">
                                                <View/>
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <Pagination
                        currentPage={filters.currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                </>
            )}
        </div>
    );
};

export default FilteredTable;
