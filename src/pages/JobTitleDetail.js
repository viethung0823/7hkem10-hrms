import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Col, Row, Button, Card, Alert, Breadcrumb, Modal } from '@themesberg/react-bootstrap';
import { useParams, useHistory } from "react-router-dom";
import { apiService } from "../services/api";
import { Routes } from "../routes";

export default () => {
  const { id } = useParams();
  const history = useHistory();
  const [jobTitle, setJobTitle] = useState(null);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [companies, setCompanies] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    const fetchJobTitle = async () => {
      try {
        const data = await apiService.getJobTitle(id);
        setJobTitle(data);
        setError(null);
      } catch (error) {
        console.error('Error fetching job title:', error);
        setError(error.message || 'Failed to fetch job title details');
      }
    };

    // Load data from localStorage
    const storedCompanies = localStorage.getItem('companies');
    const storedDepartments = localStorage.getItem('departments');
    const storedLocations = localStorage.getItem('locations');

    if (storedCompanies) setCompanies(JSON.parse(storedCompanies));
    if (storedDepartments) setDepartments(JSON.parse(storedDepartments));
    if (storedLocations) setLocations(JSON.parse(storedLocations));

    fetchJobTitle();
  }, [id]);

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await apiService.deleteJobTitle(id);
      history.push(Routes.JobTitle.path);
    } catch (error) {
      setError(error.message || 'Failed to delete job title');
      setShowDeleteModal(false);
    } finally {
      setDeleteLoading(false);
    }
  };

  const getCompanyName = (companyId) => {
    const company = companies.find(comp => comp.id === companyId);
    return company ? company.name : 'Unknown';
  };

  const getDepartmentName = (departmentId) => {
    const department = departments.find(dept => dept.id === departmentId);
    return department ? department.name : 'Unknown';
  };

  const getLocationName = (locationId) => {
    const location = locations.find(loc => loc.id === locationId);
    return location ? location.name : 'Unknown';
  };

  if (error) {
    return (
      <Alert variant="danger" className="mt-3">
        {error}
      </Alert>
    );
  }

  if (!jobTitle) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-4">
        <div className="d-block mb-4 mb-md-0">
          <Breadcrumb className="d-none d-md-inline-block" listProps={{ className: "breadcrumb-dark breadcrumb-transparent" }}>
            <Breadcrumb.Item><FontAwesomeIcon icon={faHome} /></Breadcrumb.Item>
            <Breadcrumb.Item>Job Titles</Breadcrumb.Item>
            <Breadcrumb.Item active>Job Title Details</Breadcrumb.Item>
          </Breadcrumb>
          <h4>Job Title Details</h4>
        </div>
        <div className="btn-toolbar mb-2 mb-md-0">
          <Button
            variant="primary"
            size="sm"
            className="me-2"
            onClick={() => history.push(`${Routes.JobTitleEdit.path.replace(':id', id)}`)}
          >
            Edit Job Title
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => setShowDeleteModal(true)}
          >
            <FontAwesomeIcon icon={faTrash} className="me-2" />
            Delete Job Title
          </Button>
        </div>
      </div>

      <Row>
        <Col xs={12} xl={8}>
          <Card border="light" className="bg-white shadow-sm mb-4">
            <Card.Body>
              <h5 className="mb-4">Job Title Information</h5>
              <Row>
                <Col md={6} className="mb-3">
                  <h6>Name</h6>
                  <p>{jobTitle.name}</p>
                </Col>
                <Col md={6} className="mb-3">
                  <h6>Code</h6>
                  <p>{jobTitle.code}</p>
                </Col>
              </Row>

              <Row>
                <Col md={12} className="mb-3">
                  <h6>Description</h6>
                  <p>{jobTitle.description}</p>
                </Col>
              </Row>

              <Row>
                <Col md={4} className="mb-3">
                  <h6>Company</h6>
                  <p>{getCompanyName(jobTitle.company)}</p>
                </Col>
                <Col md={4} className="mb-3">
                  <h6>Department</h6>
                  <p>{getDepartmentName(jobTitle.department)}</p>
                </Col>
                <Col md={4} className="mb-3">
                  <h6>Location</h6>
                  <p>{getLocationName(jobTitle.location)}</p>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Modal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this job title? This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowDeleteModal(false)}
            disabled={deleteLoading}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={handleDelete}
            disabled={deleteLoading}
          >
            {deleteLoading ? 'Deleting...' : 'Delete'}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};