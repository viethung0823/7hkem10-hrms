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
  const [employee, setEmployee] = useState(null);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [locationData, setLocationData] = useState({
    provinces: [],
    districts: [],
    districtWards: [],
    locations: []
  });

  useEffect(() => {
    // Load location data from localStorage
    const provinces = JSON.parse(localStorage.getItem('provinces') || '[]');
    const districts = JSON.parse(localStorage.getItem('districts') || '[]');
    const districtWards = JSON.parse(localStorage.getItem('districtWards') || '[]');
    const locations = JSON.parse(localStorage.getItem('locations') || '[]');

    setLocationData({
      provinces,
      districts,
      districtWards,
      locations
    });
  }, []);

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const data = await apiService.getEmployee(id);
        setEmployee(data);
        setError(null);
      } catch (error) {
        console.error('Error fetching employee:', error);
        setError(error.message || 'Failed to fetch employee details');
      }
    };

    fetchEmployee();
  }, [id]);

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await apiService.deleteEmployee(id);
      history.push(Routes.Employee.path);
    } catch (error) {
      setError(error.message || 'Failed to delete employee');
      setShowDeleteModal(false);
    } finally {
      setDeleteLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString || dateString === 'string') return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const getLocationName = (id, type) => {
    if (!id) return 'N/A';
    const data = locationData[type] || [];
    const item = data.find(item => item.id === id);
    return item ? item.name : 'N/A';
  };

  if (error) {
    return (
      <Alert variant="danger" className="mt-3">
        {error}
      </Alert>
    );
  }

  if (!employee) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-4">
        <div className="d-block mb-4 mb-md-0">
          <Breadcrumb className="d-none d-md-inline-block" listProps={{ className: "breadcrumb-dark breadcrumb-transparent" }}>
            <Breadcrumb.Item><FontAwesomeIcon icon={faHome} /></Breadcrumb.Item>
            <Breadcrumb.Item>Employees</Breadcrumb.Item>
            <Breadcrumb.Item active>Employee Details</Breadcrumb.Item>
          </Breadcrumb>
          <h4>Employee Details</h4>
        </div>
        <div className="btn-toolbar mb-2 mb-md-0">
          <Button
            variant="primary"
            size="sm"
            className="me-2"
            onClick={() => history.push(`${Routes.EmployeeEdit.path.replace(':id', id)}`)}
          >
            Edit Employee
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => setShowDeleteModal(true)}
          >
            <FontAwesomeIcon icon={faTrash} className="me-2" />
            Delete Employee
          </Button>
        </div>
      </div>

      <Row>
        <Col xs={12} xl={8}>
          <Card border="light" className="bg-white shadow-sm mb-4">
            <Card.Body>
              <h5 className="mb-4">Personal Information</h5>
              <Row>
                <Col md={6} className="mb-3">
                  <h6>Name</h6>
                  <p>{employee.name}</p>
                </Col>
                <Col md={6} className="mb-3">
                  <h6>Code</h6>
                  <p>{employee.code}</p>
                </Col>
              </Row>
              <Row>
                <Col md={6} className="mb-3">
                  <h6>Email</h6>
                  <p>{employee.email}</p>
                </Col>
                <Col md={6} className="mb-3">
                  <h6>Phone</h6>
                  <p>{employee.workPhone}</p>
                </Col>
              </Row>
              <Row>
                <Col md={6} className="mb-3">
                  <h6>Gender</h6>
                  <p>{employee.gender}</p>
                </Col>
                <Col md={6} className="mb-3">
                  <h6>Birthday</h6>
                  <p>{formatDate(employee.birthday)}</p>
                </Col>
              </Row>
              <Row>
                <Col md={6} className="mb-3">
                  <h6>Place of Birth</h6>
                  <p>{employee.placeOfBirth}</p>
                </Col>
                <Col md={6} className="mb-3">
                  <h6>Marital Status</h6>
                  <p>{employee.maritalStatus?.name || 'N/A'}</p>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          <Card border="light" className="bg-white shadow-sm mb-4">
            <Card.Body>
              <h5 className="mb-4">Employment Information</h5>
              <Row>
                <Col md={6} className="mb-3">
                  <h6>Join Date</h6>
                  <p>{formatDate(employee.dateJoin)}</p>
                </Col>
                <Col md={6} className="mb-3">
                  <h6>Left Date</h6>
                  <p>{formatDate(employee.dateLeft)}</p>
                </Col>
              </Row>
              <Row>
                <Col md={6} className="mb-3">
                  <h6>Status</h6>
                  <p>{employee.status || 'Active'}</p>
                </Col>
                <Col md={6} className="mb-3">
                  <h6>Union Member</h6>
                  <p>{employee.isUnion ? 'Yes' : 'No'}</p>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          <Card border="light" className="bg-white shadow-sm mb-4">
            <Card.Body>
              <h5 className="mb-4">Contact Information</h5>
              <Row>
                <Col md={6} className="mb-3">
                  <h6>Current Address</h6>
                  <p>
                    {employee.street}, {getLocationName(employee.districWard, 'districtWards')}, {' '}
                    {getLocationName(employee.district, 'districts')}, {' '}
                    {getLocationName(employee.province, 'provinces')}
                  </p>
                </Col>
                <Col md={6} className="mb-3">
                  <h6>Permanent Address</h6>
                  <p>{employee.permanentAddress}</p>
                </Col>
              </Row>
              <Row>
                <Col md={6} className="mb-3">
                  <h6>Emergency Contact</h6>
                  <p>{employee.emergencyContact}</p>
                </Col>
                <Col md={6} className="mb-3">
                  <h6>Emergency Phone</h6>
                  <p>{employee.emergencyPhone}</p>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          <Card border="light" className="bg-white shadow-sm mb-4">
            <Card.Body>
              <h5 className="mb-4">Identification Information</h5>
              <Row>
                <Col md={6} className="mb-3">
                  <h6>ID Number</h6>
                  <p>{employee.idNumber}</p>
                </Col>
                <Col md={6} className="mb-3">
                  <h6>ID Date</h6>
                  <p>{formatDate(employee.idDate)}</p>
                </Col>
              </Row>
              <Row>
                <Col md={6} className="mb-3">
                  <h6>ID Address</h6>
                  <p>{employee.idAddress}</p>
                </Col>
                <Col md={6} className="mb-3">
                  <h6>Passport</h6>
                  <p>{employee.passport || 'N/A'}</p>
                </Col>
              </Row>
              <Row>
                <Col md={6} className="mb-3">
                  <h6>Social Insurance Code</h6>
                  <p>{employee.socialInsuranceCode}</p>
                </Col>
                <Col md={6} className="mb-3">
                  <h6>Tax Code</h6>
                  <p>{employee.taxCode}</p>
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
          Are you sure you want to delete this employee? This action cannot be undone.
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
