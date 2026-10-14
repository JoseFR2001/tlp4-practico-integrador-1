import React from 'react';
import { Modal } from './Modal';
import { LayersIcon, SparklesIcon, CheckIcon } from '../Icons';

interface PatternsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PatternsModal: React.FC<PatternsModalProps> = ({ isOpen, onClose }) => {
  const patterns = [
    {
      name: 'Singleton',
      subtitle: 'DatabaseConnection',
      tag: 'Creacional',
      desc: 'Garantiza una única instancia global de la conexión a la base de datos MongoDB (Mongoose) en el backend, previniendo múltiples pools de conexión redundantes.',
    },
    {
      name: 'Observer',
      subtitle: 'EventPublisher & NotificationService',
      tag: 'Comportamiento',
      desc: 'Al cambiar el estado de un libro (DISPONIBLE ➔ PRESTADO / EN_REPARACION), el EventPublisher notifica inmediatamente a los observadores (NotificationService), disparando el flujo a todos los usuarios suscritos.',
    },
    {
      name: 'Factory',
      subtitle: 'NotifierFactory',
      tag: 'Creacional',
      desc: 'Crea de manera desacoplada los canales de notificación necesarios (InAppNotifier y ConsoleNotifierAdapter) según el tipo de canal requerido sin exponer la lógica de instanciación.',
    },
    {
      name: 'Adapter',
      subtitle: 'ConsoleNotifierAdapter & InAppNotifier',
      tag: 'Estructural',
      desc: 'Adapta la interfaz estándar INotifier al canal de salida por consola del backend y a la persistencia en base de datos para la bandeja del usuario.',
    },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Patrones de Diseño Implementados"
      subtitle="Arquitectura del Backend reflejada en tiempo real en la aplicación"
      maxWidth="680px"
    >
      <div className="patterns-container">
        <div className="patterns-intro">
          <SparklesIcon size={20} className="patterns-intro-icon" />
          <p>
            Este sistema sigue rigurosamente los principios <strong>SOLID</strong> y los 4 patrones
            obligatorios de la cátedra, articulados alrededor del cambio de estado de cada libro.
          </p>
        </div>

        <div className="patterns-grid">
          {patterns.map((p) => (
            <div key={p.name} className="pattern-card">
              <div className="pattern-card-header">
                <div>
                  <span className="pattern-type-badge">{p.tag}</span>
                  <h4 className="pattern-name">{p.name}</h4>
                  <div className="pattern-symbol">{p.subtitle}</div>
                </div>
                <div className="pattern-check">
                  <CheckIcon size={16} />
                </div>
              </div>
              <p className="pattern-desc">{p.desc}</p>
            </div>
          ))}
        </div>

        <div className="patterns-flow-box">
          <div className="patterns-flow-title">
            <LayersIcon size={16} /> Flujo en Acción:
          </div>
          <code>
            Operador cambia estado ➔ LibroService ➔ EventPublisher (Observer) ➔ NotificationService ➔ NotifierFactory ➔ Adapters (Consola + In-App)
          </code>
        </div>
      </div>
    </Modal>
  );
};

