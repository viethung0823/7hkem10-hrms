import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons';
import { Col, Row, Button, Form, Card, Alert, Breadcrumb } from '@themesberg/react-bootstrap';
import { useHistory, useParams } from 'react-router-dom';
import { apiService } from "../services/api";
import { Routes } from "../routes";

export default () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    dateFrom: '',
    dateTo: '',
    salary: '',
    status: 'ACTIVE',
    contractTypeId: ''
  });
  const [contractTypes, setContractTypes] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch contract types
        const typesData = await apiService.getContractTypes();
        setContractTypes(typesData);

        // Fetch contract details
        const contractData = await apiService.getContract(id);
        setFormData({
          name: contractData.name,
          code: contractData.code,
          dateFrom: contractData.dateFrom.split('T')[0], // Format date for input
          dateTo: contractData.dateTo.split('T')[0], // Format date for input
          salary: contractData.salary,
          status: contractData.status,
          contractTypeId: contractData.contractTypeId
        });
      } catch (error) {
        setError('Failed to fetch data');
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await apiService.updateContract(id, formData);
      setSuccess('Contract updated successfully!');
      // Redirect to contract list after 2 seconds
      setTimeout(() => {
        history.push(Routes.Contract.path);
      }, 2000);
    } catch (error) {
      setError(error.message || 'Failed to update contract');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <>
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-4">
        <div className="d-block mb-4 mb-md-0">
          <Breadcrumb className="d-none d-md-inline-block" listProps={{ className: "breadcrumb-dark breadcrumb-transparent" }}>
            <Breadcrumb.Item><FontAwesomeIcon icon={faHome} /></Breadcrumb.Item>
            <Breadcrumb.Item>Contracts</Breadcrumb.Item>
            <Breadcrumb.Item active>Edit Contract</Breadcrumb.Item>
          </Breadcrumb>
          <h4>Edit Contract</h4>
        </div>
      </div>

      <Row>
        <Col xs={12} xl={8}>
          <Card border="light" className="bg-white shadow-sm mb-4">
            <Card.Body>
              <h5 className="mb-4">Contract Information</h5>
              <Form onSubmit={handleSubmit}>
                {error && <Alert variant="danger">{error}</Alert>}
                {success && <Alert variant="success">{success}</Alert>}

                <Row>
                  <Col md={6} className="mb-3">
                    <Form.Group id="name">
                      <Form.Label>Name</Form.Label>
                      <Form.Control
                        required
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter contract name"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6} className="mb-3">
                    <Form.Group id="code">
                      <Form.Label>Code</Form.Label>
                      <Form.Control
                        required
                        type="text"
                        name="code"
                        value={formData.code}
                        onChange={handleChange}
                        placeholder="Enter contract code"
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6} className="mb-3">
                    <Form.Group id="dateFrom">
                      <Form.Label>Start Date</Form.Label>
                      <Form.Control
                        required
                        type="date"
                        name="dateFrom"
                        value={formData.dateFrom}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6} className="mb-3">
                    <Form.Group id="dateTo">
                      <Form.Label>End Date</Form.Label>
                      <Form.Control
                        required
                        type="date"
                        name="dateTo"
                        value={formData.dateTo}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6} className="mb-3">
                    <Form.Group id="salary">
                      <Form.Label>Salary</Form.Label>
                      <Form.Control
                        required
                        type="number"
                        name="salary"
                        value={formData.salary}
                        onChange={handleChange}
                        placeholder="Enter salary"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6} className="mb-3">
                    <Form.Group id="contractTypeId">
                      <Form.Label>Contract Type</Form.Label>
                      <Form.Select
                        required
                        name="contractTypeId"
                        value={formData.contractTypeId}
                        onChange={handleChange}
                      >
                        <option value="">Select a contract type</option>
                        {contractTypes.map(type => (
                          <option key={type.id} value={type.id}>
                            {type.name}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6} className="mb-3">
                    <Form.Group id="status">
                      <Form.Label>Status</Form.Label>
                      <Form.Select
                        required
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                      >
                        <option value="ACTIVE">Active</option>
                        <option value="INACTIVE">Inactive</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>

                <div className="mt-3">
                  <Button variant="primary" type="submit" disabled={loading}>
                    {loading ? 'Updating...' : 'Update Contract'}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};