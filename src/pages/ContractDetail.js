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
  const [contract, setContract] = useState(null);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    const fetchContract = async () => {
      try {
        const data = await apiService.getContract(id);
        setContract(data);
        setError(null);
      } catch (error) {
        console.error('Error fetching contract:', error);
        setError(error.message || 'Failed to fetch contract details');
      }
    };

    fetchContract();
  }, [id]);

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await apiService.deleteContract(id);
      history.push(Routes.Contract.path);
    } catch (error) {
      setError(error.message || 'Failed to delete contract');
      setShowDeleteModal(false);
    } finally {
      setDeleteLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const formatSalary = (salary) => {
    if (!salary) return 'N/A';
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(salary);
  };

  if (error) {
    return (
      <Alert variant="danger" className="mt-3">
        {error}
      </Alert>
    );
  }

  if (!contract) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-4">
        <div className="d-block mb-4 mb-md-0">
          <Breadcrumb className="d-none d-md-inline-block" listProps={{ className: "breadcrumb-dark breadcrumb-transparent" }}>
            <Breadcrumb.Item><FontAwesomeIcon icon={faHome} /></Breadcrumb.Item>
            <Breadcrumb.Item>Contracts</Breadcrumb.Item>
            <Breadcrumb.Item active>Contract Details</Breadcrumb.Item>
          </Breadcrumb>
          <h4>Contract Details</h4>
        </div>
        <div className="btn-toolbar mb-2 mb-md-0">
          <Button
            variant="primary"
            size="sm"
            className="me-2"
            onClick={() => history.push(`${Routes.ContractEdit.path.replace(':id', id)}`)}
          >
            Edit Contract
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => setShowDeleteModal(true)}
          >
            <FontAwesomeIcon icon={faTrash} className="me-2" />
            Delete Contract
          </Button>
        </div>
      </div>

      <Row>
        <Col xs={12} xl={8}>
          <Card border="light" className="bg-white shadow-sm mb-4">
            <Card.Body>
              <h5 className="mb-4">Contract Information</h5>
              <Row>
                <Col md={6} className="mb-3">
                  <h6>Name</h6>
                  <p>{contract.name}</p>
                </Col>
                <Col md={6} className="mb-3">
                  <h6>Code</h6>
                  <p>{contract.code}</p>
                </Col>
              </Row>

              <Row>
                <Col md={6} className="mb-3">
                  <h6>Start Date</h6>
                  <p>{formatDate(contract.dateFrom)}</p>
                </Col>
                <Col md={6} className="mb-3">
                  <h6>End Date</h6>
                  <p>{formatDate(contract.dateTo)}</p>
                </Col>
              </Row>

              <Row>
                <Col md={6} className="mb-3">
                  <h6>Salary</h6>
                  <p>{formatSalary(contract.salary)}</p>
                </Col>
                <Col md={6} className="mb-3">
                  <h6>Status</h6>
                  <p>{contract.status}</p>
                </Col>
              </Row>

              <Row>
                <Col md={6} className="mb-3">
                  <h6>Contract Type</h6>
                  <p>{contract.contractType?.name || 'N/A'}</p>
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
          Are you sure you want to delete this contract? This action cannot be undone.
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