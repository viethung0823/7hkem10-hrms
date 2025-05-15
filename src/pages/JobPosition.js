import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Col, Row, Button, Card, Table, Alert, Breadcrumb, Modal } from '@themesberg/react-bootstrap';
import { Link } from 'react-router-dom';
import { apiService } from "../services/api";
import { Routes } from "../routes";

export default () => {
  const [jobPositions, setJobPositions] = useState([]);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedJobPosition, setSelectedJobPosition] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [companies, setCompanies] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    fetchJobPositions();
    // Load data from localStorage
    const storedCompanies = localStorage.getItem('companies');
    const storedDepartments = localStorage.getItem('departments');
    const storedLocations = localStorage.getItem('locations');

    if (storedCompanies) setCompanies(JSON.parse(storedCompanies));
    if (storedDepartments) setDepartments(JSON.parse(storedDepartments));
    if (storedLocations) setLocations(JSON.parse(storedLocations));
  }, []);

  const fetchJobPositions = async () => {
    try {
      const data = await apiService.getJobPositions();
      setJobPositions(data);
      setError(null);
    } catch (error) {
      console.error('Error fetching job positions:', error);
      setError(error.message || 'Failed to fetch job positions');
    }
  };

  const handleDeleteClick = (jobPosition) => {
    setSelectedJobPosition(jobPosition);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedJobPosition) return;

    setDeleteLoading(true);
    try {
      await apiService.deleteJobPosition(selectedJobPosition.id);
      setShowDeleteModal(false);
      setSelectedJobPosition(null);
      fetchJobPositions();
    } catch (error) {
      console.error('Error deleting job position:', error);
      setError(error.message || 'Failed to delete job position');
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

  return (
    <>
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-4">
        <div className="d-block mb-4 mb-md-0">
          <Breadcrumb className="d-none d-md-inline-block" listProps={{ className: "breadcrumb-dark breadcrumb-transparent" }}>
            <Breadcrumb.Item><FontAwesomeIcon icon={faHome} /></Breadcrumb.Item>
            <Breadcrumb.Item>Company</Breadcrumb.Item>
            <Breadcrumb.Item active>Job Positions</Breadcrumb.Item>
          </Breadcrumb>
          <h4>Job Positions</h4>
        </div>
        <div className="btn-toolbar mb-2 mb-md-0">
          <Button as={Link} to={Routes.JobPositionNew.path} variant="primary" size="sm">
            <FontAwesomeIcon icon={faEdit} className="me-2" /> New Job Position
          </Button>
        </div>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      <Card border="light" className="table-wrapper table-responsive shadow-sm">
        <Card.Body className="pt-0">
          <Table hover className="user-table align-items-center">
            <thead>
              <tr>
                <th className="border-bottom">Name</th>
                <th className="border-bottom">Target Recruitment</th>
                <th className="border-bottom">Job Summary</th>
                <th className="border-bottom">Company</th>
                <th className="border-bottom">Department</th>
                <th className="border-bottom">Location</th>
                <th className="border-bottom">Recruiting</th>
                <th className="border-bottom">Actions</th>
              </tr>
            </thead>
            <tbody>
              {jobPositions.map(jobPosition => (
                <tr key={jobPosition.id}>
                  <td>
                    <Link to={`${Routes.JobPositionDetail.path.replace(':id', jobPosition.id)}`}>
                      {jobPosition.name}
                    </Link>
                  </td>
                  <td>{jobPosition.targetRecruitment}</td>
                  <td>{jobPosition.jobSummary}</td>
                  <td>{getCompanyName(jobPosition.company)}</td>
                  <td>{getDepartmentName(jobPosition.department)}</td>
                  <td>{getLocationName(jobPosition.location)}</td>
                  <td>{jobPosition.isRecruiting ? 'Yes' : 'No'}</td>
                  <td>
                    <Button
                      as={Link}
                      to={`${Routes.JobPositionEdit.path.replace(':id', jobPosition.id)}`}
                      variant="info"
                      size="sm"
                      className="me-2"
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDeleteClick(jobPosition)}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

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