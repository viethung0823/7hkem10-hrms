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
    description: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  useEffect(() => {
    const fetchJobTitle = async () => {
      try {
        const data = await apiService.getJobTitle(id);
        setFormData({
          name: data.name,
          code: data.code,
          description: data.description
        });
      } catch (error) {
        setError('Failed to fetch job title data');
        console.error('Error fetching job title:', error);
      }
    };

    fetchJobTitle();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await apiService.updateJobTitle(id, formData);
      setSuccess('Job title updated successfully!');
      // Redirect to job title list after 2 seconds
      setTimeout(() => {
        history.push(Routes.JobTitle.path);
      }, 2000);
    } catch (error) {
      setError(error.message || 'Failed to update job title');
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
            <Breadcrumb.Item>Job Titles</Breadcrumb.Item>
            <Breadcrumb.Item active>Edit Job Title</Breadcrumb.Item>
          </Breadcrumb>
          <h4>Edit Job Title</h4>
        </div>
      </div>

      <Row>
        <Col xs={12} xl={8}>
          <Card border="light" className="bg-white shadow-sm mb-4">
            <Card.Body>
              <h5 className="mb-4">Job Title Information</h5>
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
                        placeholder="Enter job title name"
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
                        placeholder="Enter job title code"
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={12} className="mb-3">
                    <Form.Group id="description">
                      <Form.Label>Description</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Enter job title description"
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <div className="mt-3">
                  <Button variant="primary" type="submit" disabled={loading}>
                    {loading ? 'Updating...' : 'Update Job Title'}
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