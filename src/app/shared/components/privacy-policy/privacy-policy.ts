import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-privacy-policy',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="legal-container">
      <div class="legal-header">
        <h1>Política de Privacidad</h1>
        <p class="last-updated">Última actualización: {{ lastUpdated() }}</p>
      </div>

      <div class="legal-content">
        <section>
          <h2>1. Información que Recopilamos</h2>
          <p>En cumplimiento de la Ley 25.326 de Protección de Datos Personales de Argentina, recopilamos:</p>
          <ul>
            <li><strong>Datos personales:</strong> Nombre, apellido</li>
            <li><strong>Datos de contacto:</strong> Email, teléfono, dirección postal</li>
            <li><strong>Datos del vehículo:</strong> Marca, modelo, año, uso del vehículo</li>
            <li><strong>Datos de navegación:</strong> Cookies, dirección IP, historial de navegación</li>
          </ul>
        </section>

        <section>
          <h2>2. Uso de la Información</h2>
          <p>Utilizamos sus datos para:</p>
          <ul>
            <li>Generar cotizaciones de seguros personalizadas</li>
            <li>Procesar solicitudes de contratación</li>
            <li>Enviar comunicaciones relacionadas con nuestros servicios</li>
            <li>Cumplir con obligaciones legales y regulatorias</li>
            <li>Mejorar nuestros servicios y experiencia del usuario</li>
          </ul>
        </section>

        <section>
          <h2>3. Base Legal del Tratamiento</h2>
          <p>Procesamos sus datos personales basándonos en:</p>
          <ul>
            <li><strong>Consentimiento:</strong> Usted nos otorga permiso explícito</li>
            <li><strong>Ejecución contractual:</strong> Para prestar nuestros servicios</li>
            <li><strong>Obligación legal:</strong> Cumplimiento de normativas del sector asegurador</li>
            <li><strong>Interés legítimo:</strong> Para mejorar nuestros servicios</li>
          </ul>
        </section>

        <section>
          <h2>4. Compartir Información</h2>
          <p>Sus datos pueden ser compartidos con:</p>
          <ul>
            <li><strong>Compañías aseguradoras:</strong> Para procesar cotizaciones y pólizas</li>
            <li><strong>Proveedores de servicios:</strong> Que nos ayudan a operar nuestra plataforma</li>
            <li><strong>Autoridades competentes:</strong> Cuando sea requerido por ley</li>
          </ul>
          <p><strong>No vendemos ni alquilamos sus datos personales a terceros.</strong></p>
        </section>

        <section>
          <h2>5. Sus Derechos (Ley 25.326)</h2>
          <p>Usted tiene derecho a:</p>
          <ul>
            <li><strong>Acceso:</strong> Solicitar información sobre sus datos personales</li>
            <li><strong>Rectificación:</strong> Corregir datos inexactos o incompletos</li>
            <li><strong>Supresión:</strong> Eliminar sus datos cuando no sean necesarios</li>
            <li><strong>Oposición:</strong> Oponerse al tratamiento de sus datos</li>
            <li><strong>Portabilidad:</strong> Obtener sus datos en formato estructurado</li>
          </ul>
          <p>Para ejercer estos derechos, contáctenos en: <strong>davidroman.desarrollador&#64;gmail.com</strong></p>
        </section>

        <section>
          <h2>6. Seguridad de los Datos</h2>
          <p>Implementamos medidas técnicas y organizativas apropiadas para proteger sus datos:</p>
          <ul>
            <li>Cifrado SSL/TLS para transmisión de datos</li>
            <li>Acceso restringido a datos personales</li>
            <li>Auditorías regulares de seguridad</li>
            <li>Capacitación del personal en protección de datos</li>
          </ul>
        </section>

        <section>
          <h2>7. Cookies y Tecnologías Similares</h2>
          <p>Utilizamos cookies para:</p>
          <ul>
            <li>Recordar sus preferencias</li>
            <li>Analizar el uso de nuestro sitio web</li>
            <li>Personalizar contenido y anuncios</li>
          </ul>
          <p>Puede gestionar las cookies desde la configuración de su navegador.</p>
        </section>

        <section>
          <h2>8. Retención de Datos</h2>
          <p>Conservamos sus datos mientras:</p>
          <ul>
            <li>Mantenga una cuenta activa con nosotros</li>
            <li>Sea necesario para cumplir obligaciones legales</li>
            <li>Existan intereses legítimos para su conservación</li>
          </ul>
          <p>Los datos se eliminan de forma segura al finalizar estos períodos.</p>
        </section>

        <section>
          <h2>9. Menores de Edad</h2>
          <p>Nuestros servicios están dirigidos a personas mayores de 18 años. No recopilamos intencionalmente datos de menores de edad.</p>
        </section>

        <section>
          <h2>10. Transferencias Internacionales</h2>
          <p>Sus datos se procesan principalmente en Argentina. Si realizamos transferencias internacionales, garantizamos un nivel adecuado de protección.</p>
        </section>

        <section>
          <h2>11. Cambios en esta Política</h2>
          <p>Podemos actualizar esta política periódicamente. Le notificaremos cambios significativos por email o mediante aviso en nuestro sitio web.</p>
        </section>

        <section>
          <h2>12. Contacto</h2>
          <div class="contact-info">
            <p><strong>Responsable del Tratamiento:</strong> David Antonio Román</p>
            <p><strong>Email:</strong> davidroman.desarrollador&#64;gmail.com</p>
            <p><strong>Teléfono:</strong> +54 341 265564</p>
            <p><strong>Dirección:</strong> Funes, Provincia de Santa Fe, Argentina</p>
          </div>
        </section>

        <section>
          <h2>13. Autoridad de Control</h2>
          <p>Si tiene consultas sobre el tratamiento de sus datos que no podamos resolver, puede contactar a:</p>
          <div class="authority-info">
            <p><strong>Agencia de Acceso a la Información Pública</strong></p>
            <p>Dirección: Av. Pte. Gral. Julio A. Roca 710, C1067ABP CABA</p>
            <p>Teléfono: 0800-222-2274</p>
            <p>Email: consultas&#64;aaip.gob.ar</p>
          </div>
        </section>
      </div>

      <div class="legal-footer">
        <button class="btn btn-secondary" (click)="goBack()">
          <i class="fas fa-arrow-left"></i>
          Volver
        </button>
      </div>
    </div>
  `,
  styles: [`
    .legal-container {
      max-width: 800px;
      margin: 0 auto;
      padding: 2rem;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.6;
      color: #333;
    }

    .legal-header {
      text-align: center;
      margin-bottom: 3rem;
      padding-bottom: 2rem;
      border-bottom: 2px solid #e9ecef;
    }

    .legal-header h1 {
      color: #2c3e50;
      font-size: 2.5rem;
      margin-bottom: 0.5rem;
      font-weight: 600;
    }

    .last-updated {
      color: #6c757d;
      font-style: italic;
      margin: 0;
    }

    .legal-content {
      margin-bottom: 3rem;
    }

    section {
      margin-bottom: 2.5rem;
    }

    h2 {
      color: #2c3e50;
      font-size: 1.4rem;
      margin-bottom: 1rem;
      border-left: 4px solid #007bff;
      padding-left: 1rem;
    }

    p {
      margin-bottom: 1rem;
      text-align: justify;
    }

    ul {
      margin-bottom: 1rem;
      padding-left: 1.5rem;
    }

    li {
      margin-bottom: 0.5rem;
    }

    strong {
      color: #2c3e50;
    }

    .contact-info, .authority-info {
      background-color: #f8f9fa;
      padding: 1.5rem;
      border-radius: 8px;
      border-left: 4px solid #28a745;
    }

    .legal-footer {
      text-align: left;
      padding-top: 2rem;
      border-top: 2px solid #e9ecef;
    }

    .btn {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 6px;
      font-size: 1rem;
      font-weight: 500;
      text-decoration: none;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .btn-primary {
      background-color: #007bff;
      color: white;
    }

    .btn-primary:hover {
      background-color: #0056b3;
      transform: translateY(-2px);
    }

    .btn-secondary {
    background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
    color: white;
    font-weight: 600;
    box-shadow: 0 4px 15px rgba(0, 123, 255, 0.3);
    
    @media (max-width: 576px) {
      width: 100%;
      justify-content: center;
    }

    &:hover {
      background: linear-gradient(135deg, #0056b3 0%, #004085 100%);
      box-shadow: 0 6px 20px rgba(0, 123, 255, 0.4);
      color: white;
      transform: translateY(-2px);
    }

    &:focus {
      outline: 2px solid rgba(0, 123, 255, 0.3);
      outline-offset: 2px;
    }
  }

    @media (max-width: 768px) {
      .legal-container {
        padding: 1rem;
      }

      .legal-header h1 {
        font-size: 2rem;
      }

      h2 {
        font-size: 1.2rem;
      }
    }
  `]
})
export class PrivacyPolicyComponent {
  lastUpdated = signal('2 de Agosto de 2025');

  constructor(private router: Router) {}

  goBack() {
    this.router.navigate(['/']);
  }
}