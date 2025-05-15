import React, { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons';
import { Form, Button, Breadcrumb, Alert, Card } from '@themesberg/react-bootstrap';
import { useHistory } from 'react-router-dom';
import { apiService } from "../services/api";
import { Routes } from "../routes";

export default () => {
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess('');

    try {
      await apiService.createContractType(formData);
      setSuccess('Contract type created successfully!');
      // Redirect to contract types list after a short delay
      setTimeout(() => {
        history.push(Routes.ContractType.path);
      }, 1500);
    } catch (error) {
      setError(error.message || 'Failed to create contract type');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {error && (
        <Alert variant="danger" className="mt-3">
          {error}
        </Alert>
      )}
      {success && (
        <Alert variant="success" className="mt-3">
          {success}
        </Alert>
      )}

      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-4">
        <div className="d-block mb-4 mb-md-0">
          <Breadcrumb className="d-none d-md-inline-block" listProps={{ className: "breadcrumb-dark breadcrumb-transparent" }}>
            <Breadcrumb.Item><FontAwesomeIcon icon={faHome} /></Breadcrumb.Item>
            <Breadcrumb.Item>Contract Types</Breadcrumb.Item>
            <Breadcrumb.Item active>New Contract Type</Breadcrumb.Item>
          </Breadcrumb>
          <h4>New Contract Type</h4>
        </div>
      </div>

      <Card border="light" className="bg-white shadow-sm mb-4">
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                required
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter contract type name"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter contract type description"
              />
            </Form.Group>

            <div className="mt-3">
              <Button
                variant="primary"
                type="submit"
                disabled={loading}
                className="me-2"
              >
                {loading ? 'Creating...' : 'Create Contract Type'}
              </Button>
              <Button
                variant="secondary"
                onClick={() => history.push(Routes.ContractType.path)}
              >
                Cancel
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </>
  );
};