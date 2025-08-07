import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-terms-conditions',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="legal-container">
      <div class="legal-header">
        <h1>Términos y Condiciones</h1>
        <p class="last-updated">Última actualización: {{ lastUpdated() }}</p>
      </div>

      <div class="legal-content">
        <section>
          <h2>1. Aceptación de los Términos</h2>
          <p>Al acceder y utilizar este sitio web y nuestros servicios, usted acepta estar sujeto a estos Términos y Condiciones y a todas las leyes y regulaciones aplicables de la República Argentina.</p>
          <p>Si no está de acuerdo con alguno de estos términos, no debe utilizar nuestros servicios.</p>
        </section>

        <section>
          <h2>2. Descripción del Servicio</h2>
          <p>Somos un intermediario digital que facilita la cotización y contratación de seguros de automóviles. Nuestros servicios incluyen:</p>
          <ul>
            <li>Cotización online de seguros de auto</li>
            <li>Comparación de planes y coberturas</li>
            <li>Intermediación con compañías aseguradoras</li>
            <li>Asesoramiento básico sobre seguros</li>
            <li>Gestión de documentación básica</li>
          </ul>
        </section>

        <section>
          <h2>3. Marco Legal</h2>
          <p>Nuestras actividades se rigen por:</p>
          <ul>
            <li><strong>Ley 17.418</strong> - Ley de Seguros</li>
            <li><strong>Ley 22.400</strong> - Ley del Productor Asesor de Seguros</li>
            <li><strong>Ley 24.240</strong> - Ley de Defensa del Consumidor</li>
            <li><strong>Ley 25.326</strong> - Ley de Protección de Datos Personales</li>
            <li>Normativas de la Superintendencia de Seguros de la Nación (SSN)</li>
          </ul>
        </section>

        <section>
          <h2>4. Registro y Cuenta de Usuario</h2>
          <p>Para utilizar nuestros servicios, usted debe:</p>
          <ul>
            <li>Ser mayor de 18 años</li>
            <li>Proporcionar información veraz y actualizada</li>
            <li>Mantener la confidencialidad de sus credenciales</li>
            <li>Notificar inmediatamente cualquier uso no autorizado</li>
          </ul>
        </section>

        <section>
          <h2>5. Uso Aceptable</h2>
          <p>Al utilizar nuestros servicios, usted se compromete a:</p>
          <ul>
            <li>Proporcionar información veraz y completa</li>
            <li>No utilizar el servicio para actividades ilegales</li>
            <li>No intentar comprometer la seguridad del sistema</li>
            <li>No interferir con el funcionamiento normal del servicio</li>
            <li>Respetar los derechos de propiedad intelectual</li>
          </ul>
        </section>

        <section>
          <h2>6. Limitaciones del Servicio</h2>
          <p>Nuestro servicio tiene las siguientes limitaciones:</p>
          <ul>
            <li>Las cotizaciones son estimativas y pueden variar</li>
            <li>La contratación final depende de la aprobación de la aseguradora</li>
            <li>No garantizamos la disponibilidad continua del servicio</li>
            <li>Podemos modificar o discontinuar funcionalidades</li>
          </ul>
        </section>

        <section>
          <h2>7. Responsabilidades</h2>
          <h3>7.1 Nuestras Responsabilidades</h3>
          <ul>
            <li>Actuar con la diligencia de un buen intermediario</li>
            <li>Mantener la confidencialidad de sus datos</li>
            <li>Brindar información clara sobre coberturas</li>
            <li>Facilitar la comunicación con las aseguradoras</li>
          </ul>
          
          <h3>7.2 Sus Responsabilidades</h3>
          <ul>
            <li>Proporcionar información completa y veraz</li>
            <li>Leer y comprender las condiciones de las pólizas</li>
            <li>Pagar las primas en tiempo y forma</li>
            <li>Notificar cambios que afecten el riesgo asegurado</li>
          </ul>
        </section>

        <section>
          <h2>8. Limitación de Responsabilidad</h2>
          <p>Conforme a la legislación argentina:</p>
          <ul>
            <li>No somos responsables por las decisiones de las aseguradoras</li>
            <li>No garantizamos resultados específicos de las cotizaciones</li>
            <li>Nuestra responsabilidad se limita al monto de la comisión recibida</li>
            <li>No somos responsables por daños indirectos o consecuenciales</li>
          </ul>
        </section>

        <section>
          <h2>9. Propiedad Intelectual</h2>
          <p>Todo el contenido del sitio web, incluyendo textos, gráficos, logos, iconos, imágenes, clips de audio, descargas digitales y compilaciones de datos, es propiedad exclusiva de David Antonio Román o sus proveedores de contenido.</p>
        </section>

        <section>
          <h2>10. Privacidad y Protección de Datos</h2>
          <p>El tratamiento de sus datos personales se rige por nuestra Política de Privacidad y la Ley 25.326. Al utilizar nuestros servicios, usted consiente el tratamiento de sus datos conforme a dicha política.</p>
        </section>

        <section>
          <h2>11. Derecho de Desistimiento</h2>
          <p>Conforme al artículo 34 de la Ley 24.240, usted tiene derecho a desistir de la contratación dentro de los 10 días corridos de recibida la póliza, sin expresión de causa y sin penalidad.</p>
        </section>

        <section>
          <h2>12. Resolución de Disputas</h2>
          <p>En caso de controversias:</p>
          <ul>
            <li>Intentaremos resolver amigablemente cualquier disputa</li>
            <li>Puede acudir al Centro de Atención al Usuario de SSN</li>
            <li>Los tribunales competentes serán los de la Ciudad de Rosario, Santa Fe</li>
            <li>Se aplicará la legislación argentina</li>
          </ul>
        </section>

        <section>
          <h2>13. Modificaciones</h2>
          <p>Nos reservamos el derecho de modificar estos términos en cualquier momento. Las modificaciones entrarán en vigor inmediatamente después de su publicación en el sitio web.</p>
        </section>

        <section>
          <h2>14. Terminación</h2>
          <p>Podemos terminar o suspender su acceso inmediatamente, sin previo aviso, por cualquier motivo, incluyendo el incumplimiento de estos Términos y Condiciones.</p>
        </section>

        <section>
          <h2>15. Información de Contacto</h2>
          <div class="contact-info">
            <p><strong>nombre:</strong> David Antonio Román</p>
            <p><strong>Email:</strong> davidroman.desarrollador&#64;gmail.com</p>
            <p><strong>Teléfono:</strong> +54 341 265564</p>
            <p><strong>Dirección:</strong> Funes, Provincia de Santa Fe, Argentina</p>
          </div>
        </section>

        <section>
          <h2>16. Disposiciones Generales</h2>
          <ul>
            <li>Si alguna disposición es inválida, el resto permanece en vigor</li>
            <li>Estos términos constituyen el acuerdo completo entre las partes</li>
            <li>La renuncia a un derecho no implica renuncia a derechos futuros</li>
            <li>Los títulos son solo para referencia</li>
          </ul>
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

    h3 {
      color: #495057;
      font-size: 1.2rem;
      margin-top: 1.5rem;
      margin-bottom: 0.5rem;
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

    .contact-info {
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
export class TermsConditionsComponent {
  lastUpdated = signal('2 de Agosto de 2025');

  constructor(private router: Router) {}

  goBack() {
    this.router.navigate(['/']);
  }
}