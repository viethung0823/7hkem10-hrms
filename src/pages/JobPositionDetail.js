import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Button, Card, Row, Col, Alert, Breadcrumb, Modal } from '@themesberg/react-bootstrap';
import { Link, useParams, useHistory } from 'react-router-dom';
import { apiService } from "../services/api";
import { Routes } from "../routes";

export default () => {
  const { id } = useParams();
  const history = useHistory();
  const [jobPosition, setJobPosition] = useState(null);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    fetchJobPosition();
  }, [fetchJobPosition, id]);

  const fetchJobPosition = async () => {
    try {
      const data = await apiService.getJobPosition(id);
      setJobPosition(data);
      setError(null);
    } catch (error) {
      console.error('Error fetching job position:', error);
      setError(error.message || 'Failed to fetch job position details');
    }
  };

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    setDeleteLoading(true);
    try {
      await apiService.deleteJobPosition(id);
      setShowDeleteModal(false);
      history.push('/job-positions');
    } catch (error) {
      console.error('Error deleting job position:', error);
      setError(error.message || 'Failed to delete job position');
    } finally {
      setDeleteLoading(false);
    }
  };

  if (!jobPosition && !error) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-4">
        <div className="d-block mb-4 mb-md-0">
          <Breadcrumb className="d-none d-md-inline-block" listProps={{ className: "breadcrumb-dark breadcrumb-transparent" }}>
            <Breadcrumb.Item><FontAwesomeIcon icon={faHome} /></Breadcrumb.Item>
            <Breadcrumb.Item>Company</Breadcrumb.Item>
            <Breadcrumb.Item>Job Positions</Breadcrumb.Item>
            <Breadcrumb.Item active>Job Position Details</Breadcrumb.Item>
          </Breadcrumb>
          <h4>Job Position Details</h4>
        </div>
        <div className="btn-toolbar mb-2 mb-md-0">
          <Button
            as={Link}
            to={`${Routes.JobPositionEdit.path.replace(':id', id)}`}
            variant="primary"
            size="sm"
            className="me-2"
          >
            <FontAwesomeIcon icon={faEdit} className="me-2" /> Edit
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={handleDeleteClick}
          >
            <FontAwesomeIcon icon={faTrash} className="me-2" /> Delete
          </Button>
        </div>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      {jobPosition && (
        <Card border="light" className="bg-white shadow-sm">
          <Card.Body>
            <Row>
              <Col md={6}>
                <h5 className="mb-3">Basic Information</h5>
                <div className="mb-3">
                  <strong>Name:</strong> {jobPosition.name}
                </div>
                <div className="mb-3">
                  <strong>Target Recruitment:</strong> {jobPosition.targetRecruitment}
                </div>
                <div className="mb-3">
                  <strong>Currently Recruiting:</strong> {jobPosition.isRecruiting ? 'Yes' : 'No'}
                </div>
              </Col>
              <Col md={6}>
                <h5 className="mb-3">Organization</h5>
                <div className="mb-3">
                  <strong>Company:</strong> {jobPosition.company}
                </div>
                <div className="mb-3">
                  <strong>Department:</strong> {jobPosition.department}
                </div>
                <div className="mb-3">
                  <strong>Location:</strong> {jobPosition.location}
                </div>
              </Col>
            </Row>

            <Row className="mt-4">
              <Col md={12}>
                <h5 className="mb-3">Job Summary</h5>
                <div className="mb-3">
                  {jobPosition.jobSummary}
                </div>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      )}

      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this job position?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={handleDeleteConfirm}
            disabled={deleteLoading}
          >
            {deleteLoading ? 'Deleting...' : 'Delete'}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};