const { validate, schemas } = require('../src/middleware/validation');

describe('Validation Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      body: {},
      query: {},
      params: {}
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };

    next = jest.fn();
  });

  describe('validate middleware', () => {
    it('should call next if validation passes', () => {
      req.body = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123'
      };

      const middleware = validate(schemas.register);
      middleware(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });

    it('should return 400 if validation fails', () => {
      req.body = {
        name: 'J', // Too short
        email: 'invalid-email', // Invalid format
        password: '123' // Too short
      };

      const middleware = validate(schemas.register);
      middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'Validation error',
        details: expect.arrayContaining([
          { field: 'name', message: expect.any(String) },
          { field: 'email', message: expect.any(String) },
          { field: 'password', message: expect.any(String) }
        ])
      });
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('register schema', () => {
    it('should validate correct registration data', () => {
      const { error } = schemas.register.validate({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123'
      });

      expect(error).toBeUndefined();
    });

    it('should reject missing name', () => {
      const { error } = schemas.register.validate({
        email: 'john@example.com',
        password: 'password123'
      });

      expect(error).toBeDefined();
      expect(error.details[0].path[0]).toBe('name');
    });

    it('should reject invalid email', () => {
      const { error } = schemas.register.validate({
        name: 'John Doe',
        email: 'invalid-email',
        password: 'password123'
      });

      expect(error).toBeDefined();
      expect(error.details[0].path[0]).toBe('email');
    });

    it('should reject short password', () => {
      const { error } = schemas.register.validate({
        name: 'John Doe',
        email: 'john@example.com',
        password: '123'
      });

      expect(error).toBeDefined();
      expect(error.details[0].path[0]).toBe('password');
    });
  });

  describe('login schema', () => {
    it('should validate correct login data', () => {
      const { error } = schemas.login.validate({
        email: 'john@example.com',
        password: 'password123'
      });

      expect(error).toBeUndefined();
    });

    it('should reject missing email', () => {
      const { error } = schemas.login.validate({
        password: 'password123'
      });

      expect(error).toBeDefined();
      expect(error.details[0].path[0]).toBe('email');
    });

    it('should reject missing password', () => {
      const { error } = schemas.login.validate({
        email: 'john@example.com'
      });

      expect(error).toBeDefined();
      expect(error.details[0].path[0]).toBe('password');
    });
  });
});