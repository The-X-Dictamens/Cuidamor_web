const conexionT = require('../database/db');
const { promisify } = require('util');
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
const query = promisify(conexionT.query).bind(conexionT);

/// Crear un nuevo ticket
exports.crearTicket = async (req, res) => {
    try {
        const { tipo, descripcion } = req.body;
        console.log(req.body)
      const result = await query('INSERT INTO tickets (tipo, descripcion, estatus) VALUES (?, ?, ?)', [tipo, descripcion, 'Abierto']);
      const ticketId = result.insertId;
      res.status(201).json({ message: 'Ticket creado con éxito', id_ticket: ticketId });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al crear el ticket' });
    }
  };
  
  // Obtener todos los tickets
exports.obtenerTickets = async (req, res) => {
    const queryT = `SELECT t.* FROM tickets t
    JOIN  ticket_asignacion ta ON t.id_ticket = ta.id_ticket
    JOIN empleado e ON ta.id_emp = e.id_emp
    WHERE e.id_us = ? ORDER BY prioridad DESC, fecha_creacion ASC`;
    try {
      const tickets = await query(queryT);
        res.render('./Soporte/ticketsAdmin', { tickets });

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al obtener los tickets' });
    }
  };
  
  // Obtener un ticket por ID
  exports.obtenerTicketPorId = async (req, res) => {
    try {
      const { id } = req.params;
      const [ticket] = await conexionT.query('SELECT * FROM tickets WHERE id_ticket = ?', [id]);
      if (ticket.length === 0) {
        return res.status(404).json({ message: 'Ticket no encontrado' });
      }
      res.status(200).json(ticket[0]);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al obtener el ticket' });
    }
  };
  
  // Actualizar el estado de un ticket
  exports.actualizarEstadoTicket = async (req, res) => {
    try {
      const { id } = req.params;
      const { estatus } = req.body;
      await conexionT.query('UPDATE tickets SET estatus = ? WHERE id_ticket = ?', [estatus, id]);
      res.status(200).json({ message: 'Estado del ticket actualizado con éxito' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al actualizar el estado del ticket' });
    }
};
  
  // Renderizar la vista de administración de tickets
exports.vistaAdminTickets = async (req, res) => {
      
    try {
        const tickets= await query(`
            SELECT 
                t.id_ticket,
                t.num_rastreo,
                t.tipo,
                t.descripcion,
                t.prioridad,
                t.estatus,
                t.fecha_creacion,
                ta.id_asignacion,
                ta.id_us,
                ta.fecha_asignacion
            FROM 
                tickets t
            JOIN 
                ticket_asignacion ta ON t.id_ticket = ta.id_ticket
            ORDER BY 
                t.prioridad DESC, t.fecha_creacion ASC
        `);
        res.render('./Soporte/ticketsAdmin', { tickets });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener los tickets' });
    }
};