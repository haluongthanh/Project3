import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getLogDetails, selectLogDetails } from '../../../redux/features/logSlice';
import { toast } from "react-toastify";
import BoxShadowLoader from '../../Skeletons/BoxShadowLoader';

const LogDetails = () => {
    const { id } = useParams();
    const { log } = useSelector(selectLogDetails);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getLogDetails({ id, toast }));
    }, [dispatch, id, toast]);

    if (log == undefined
    ) {
      return <BoxShadowLoader />
    }

    return (
        <div className="container mt-4">
            <h1 className="mb-4">Log Information</h1>
            <div className="card">
                <div className="card-body">
                    <form>
                        <div className="mb-3">
                            <label htmlFor="title" className="form-label">Title</label>
                            <input
                                type="text"
                                id="title"
                                className="form-control"
                                value={log.title}
                                readOnly
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="action" className="form-label">Action</label>
                            <input
                                type="text"
                                id="action"
                                className="form-control"
                                value={log.action}
                                readOnly
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="entityType" className="form-label">Entity Type</label>
                            <input
                                type="text"
                                id="entityType"
                                className="form-control"
                                value={log.entityType}
                                readOnly
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="entityId" className="form-label">Entity ID</label>
                            <input
                                type="text"
                                id="entityId"
                                className="form-control"
                                value={log.entityId}
                                readOnly
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="user" className="form-label">User</label>
                            <input
                                type="text"
                                id="user"
                                className="form-control"
                                value={log.user ? log.user.name : 'N/A'}
                                readOnly
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="user" className="form-label">User ID</label>
                            <input
                                type="text"
                                id="user"
                                className="form-control"
                                value={log.user ? log.user._id : 'N/A'}
                                readOnly
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="ipAddress" className="form-label">IP Address</label>
                            <input
                                type="text"
                                id="ipAddress"
                                className="form-control"
                                value={log.ipAddress}
                                readOnly
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="oldValue" className="form-label">Old Value</label>
                            <textarea
                                id="oldValue"
                                className="form-control"
                                value={JSON.stringify(log.oldValue, null, 2)}
                                readOnly
                                rows="6"
                                style={{ resize: 'vertical', overflowY: 'auto' }}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="newValue" className="form-label">New Value</label>
                            <textarea
                                id="newValue"
                                className="form-control"
                                value={JSON.stringify(log.newValue, null, 2)}
                                readOnly
                                rows="6"
                                style={{ resize: 'vertical', overflowY: 'auto' }}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="createdAt" className="form-label">Created At</label>
                            <input
                                type="text"
                                id="createdAt"
                                className="form-control"
                                value={new Date(log.createdAt).toLocaleString()}
                                readOnly
                            />
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default LogDetails;
