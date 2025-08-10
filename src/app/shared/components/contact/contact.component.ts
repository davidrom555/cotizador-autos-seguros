


import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import emailjs from '@emailjs/browser';


@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="contact-container">
      <div class="contact-header">
        <h1>Contacto</h1>
        <p>¿Tenés alguna consulta? Estamos acá para ayudarte</p>
      </div>

      <div class="contact-content">
        <div class="contact-info">
          <div class="info-card">
            <div class="card-icon">
              <i class="fas fa-user"></i>
            </div>
            <div class="card-content">
              <h3>David Antonio Román</h3>
              <p>Desarrollador de Sistemas</p>
            </div>
          </div>

          <div class="info-card">
            <div class="card-icon">
              <i class="fas fa-envelope"></i>
            </div>
            <div class="card-content">
              <h3>Email</h3>
              <p><a href="mailto:davidroman.desarrollador@gmail.com">davidroman.desarrollador&#64;gmail.com</a></p>
            </div>
          </div>

          <div class="info-card">
            <div class="card-icon">
              <i class="fas fa-phone"></i>
            </div>
            <div class="card-content">
              <h3>Teléfono</h3>
              <p><a href="tel:+543412655614">+54 341 265564</a></p>
              <small>Lunes a Viernes de 9:00 a 18:00 hs</small>
            </div>
          </div>

          <div class="info-card">
            <div class="card-icon">
              <i class="fas fa-map-marker-alt"></i>
            </div>
            <div class="card-content">
              <h3>Ubicación</h3>
              <p>Funes, Provincia de Santa Fe<br>Argentina</p>
            </div>
          </div>

          <div class="info-card">
            <div class="card-icon">
              <i class="fas fa-clock"></i>
            </div>
            <div class="card-content">
              <h3>Horarios de Atención</h3>
              <div class="schedule">
                <p><strong>Lunes a Viernes:</strong> 9:00 - 18:00</p>
                <p><strong>Sábados:</strong> 9:00 - 13:00</p>
                <p><strong>Domingos:</strong> Cerrado</p>
              </div>
            </div>
          </div>
        </div>

        <div class="contact-form-section">
          <h2>Envianos tu Consulta</h2>
          
          @if (showSuccessMessage()) {
            <div class="success-message">
              <i class="fas fa-check-circle"></i>
              ¡Tu consulta ha sido enviada exitosamente! Te responderemos pronto.
            </div>
          }
          
          @if (showErrorMessage()) {
            <div class="error-message-container">
              <i class="fas fa-exclamation-triangle"></i>
              Hubo un error al enviar tu consulta. Por favor, inténtalo de nuevo.
            </div>
          }

          <form [formGroup]="contactForm" (ngSubmit)="onSubmit()">
            <div class="form-row">
              <div class="form-group">
                <label for="name">Nombre y Apellido *</label>
                <input 
                  type="text" 
                  id="name" 
                  formControlName="name"
                  placeholder="Ingresá tu nombre completo"
                  [class.error]="contactForm.get('name')?.invalid && contactForm.get('name')?.touched">
                @if (contactForm.get('name')?.invalid && contactForm.get('name')?.touched) {
                  <div class="error-message">
                    El nombre es requerido
                  </div>
                }
              </div>

              <div class="form-group">
                <label for="email">Email *</label>
                <input 
                  type="email" 
                  id="email" 
                  formControlName="email"
                  placeholder="tu@email.com"
                  [class.error]="contactForm.get('email')?.invalid && contactForm.get('email')?.touched">
                @if (contactForm.get('email')?.invalid && contactForm.get('email')?.touched) {
                  <div class="error-message">
                    Ingresá un email válido
                  </div>
                }
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="phone">Teléfono</label>
                <input 
                  type="tel" 
                  id="phone" 
                  formControlName="phone"
                  placeholder="Ej: 341 2655614">
              </div>

              <div class="form-group">
                <label for="subject">Asunto *</label>
                <select id="subject" formControlName="subject" 
                        [class.error]="contactForm.get('subject')?.invalid && contactForm.get('subject')?.touched">
                  <option value="">Seleccioná un tema</option>
                  <option value="cotizacion">Consulta sobre Cotización</option>
                  <option value="poliza">Consulta sobre Póliza Existente</option>
                  <option value="siniestro">Consulta sobre Siniestro</option>
                  <option value="renovacion">Renovación de Póliza</option>
                  <option value="general">Consulta General</option>
                  <option value="reclamo">Reclamo</option>
                </select>
                @if (contactForm.get('subject')?.invalid && contactForm.get('subject')?.touched) {
                  <div class="error-message">
                    Seleccioná un asunto
                  </div>
                }
              </div>
            </div>

            <div class="form-group">
              <label for="message">Mensaje *</label>
              <textarea 
                id="message" 
                formControlName="message"
                rows="5"
                placeholder="Contanos tu consulta con el mayor detalle posible..."
                [class.error]="contactForm.get('message')?.invalid && contactForm.get('message')?.touched">
              </textarea>
              @if (contactForm.get('message')?.invalid && contactForm.get('message')?.touched) {
                <div class="error-message">
                  El mensaje es requerido
                </div>
              }
            </div>

            <div class="form-group">
              <label class="checkbox-label">
                <input type="checkbox" formControlName="acceptPrivacy">
                <span class="checkmark"></span>
                Acepto la <a href="/privacy-policy" target="_blank">Política de Privacidad</a> y los <a href="/terms-conditions" target="_blank">Términos y Condiciones</a> *
              </label>
              @if (contactForm.get('acceptPrivacy')?.invalid && contactForm.get('acceptPrivacy')?.touched) {
                <div class="error-message">
                  Debes aceptar los términos y condiciones
                </div>
              }
            </div>

            <button type="submit" class="btn btn-primary" [disabled]="contactForm.invalid || isSubmitting()">
              @if (!isSubmitting()) {
                <i class="fas fa-paper-plane"></i>
              } @else {
                <i class="fas fa-spinner fa-spin"></i>
              }
              {{ isSubmitting() ? 'Enviando...' : 'Enviar Consulta' }}
            </button>
          </form>
        </div>
      </div>

      <div class="map-section">
        <h2>Nuestra Ubicación</h2>
        <div class="map-container">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d54528.84636396265!2d-60.81684157832031!3d-32.91824!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95b65c92d17e1b01%3A0x2b0b7e8f7b5b7b5b!2sFunes%2C%20Santa%20Fe%2C%20Argentina!5e0!3m2!1ses!2sar!4v1691234567890!5m2!1ses!2sar"
            width="100%" 
            height="400" 
            style="border:0;" 
            allowfullscreen="" 
            loading="lazy" 
            referrerpolicy="no-referrer-when-downgrade">
          </iframe>
        </div>
      </div>

      <div class="contact-footer">
        <button class="btn btn-secondary" (click)="goBack()">
          <i class="fas fa-arrow-left"></i>
          Volver
        </button>
      </div>
    </div>
  `,
  styles: [`
    .contact-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }

    .contact-header {
      text-align: center;
      margin-bottom: 3rem;
    }

    .contact-header h1 {
      color: #2c3e50;
      font-size: 2.5rem;
      margin-bottom: 0.5rem;
      font-weight: 600;
    }

    .contact-header p {
      color: #6c757d;
      font-size: 1.1rem;
      margin: 0;
    }

    .contact-content {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 3rem;
      margin-bottom: 3rem;
    }

    .info-card {
      display: flex;
      align-items: flex-start;
      gap: 1rem;
      padding: 1.5rem;
      background: white;
      border-radius: 12px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      margin-bottom: 1rem;
      transition: transform 0.2s ease;
    }

    .info-card:hover {
      transform: translateY(-2px);
    }

    .card-icon {
      width: 50px;
      height: 50px;
      background: linear-gradient(135deg, #007bff, #0056b3);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .card-icon i {
      color: white;
      font-size: 1.2rem;
    }

    .card-content h3 {
      color: #2c3e50;
      margin: 0 0 0.5rem 0;
      font-size: 1.1rem;
      font-weight: 600;
    }

    .card-content p {
      color: #6c757d;
      margin: 0;
      line-height: 1.4;
    }

    .card-content a {
      color: #007bff;
      text-decoration: none;
    }

    .card-content a:hover {
      text-decoration: underline;
    }

    .schedule p {
      margin: 0.25rem 0;
    }

    .contact-form-section {
      background: white;
      padding: 2rem;
      border-radius: 12px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }

    .contact-form-section h2 {
      color: #2c3e50;
      margin-bottom: 1.5rem;
      font-size: 1.5rem;
    }

    .success-message {
      background-color: #d4edda;
      border: 1px solid #c3e6cb;
      color: #155724;
      padding: 1rem;
      border-radius: 8px;
      margin-bottom: 1.5rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .error-message-container {
      background-color: #f8d7da;
      border: 1px solid #f5c6cb;
      color: #721c24;
      padding: 1rem;
      border-radius: 8px;
      margin-bottom: 1.5rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    .form-group label {
      display: block;
      margin-bottom: 0.5rem;
      color: #2c3e50;
      font-weight: 500;
    }

    .form-group input,
    .form-group select,
    .form-group textarea {
      width: 100%;
      padding: 0.75rem;
      border: 2px solid #e9ecef;
      border-radius: 8px;
      font-size: 1rem;
      transition: border-color 0.2s ease;
      box-sizing: border-box;
    }

    .form-group input:focus,
    .form-group select:focus,
    .form-group textarea:focus {
      outline: none;
      border-color: #007bff;
    }

    .form-group input.error,
    .form-group select.error,
    .form-group textarea.error {
      border-color: #dc3545;
    }

    .error-message {
      color: #dc3545;
      font-size: 0.875rem;
      margin-top: 0.25rem;
    }

    .checkbox-label {
      display: flex;
      align-items: flex-start;
      gap: 0.5rem;
      cursor: pointer;
      font-size: 0.9rem;
      line-height: 1.4;
    }

    .checkbox-label input[type="checkbox"] {
      width: auto !important;
      margin: 0;
    }

    .map-section {
      margin-bottom: 3rem;
    }

    .map-section h2 {
      color: #2c3e50;
      text-align: center;
      margin-bottom: 2rem;
      font-size: 1.8rem;
    }

    .map-container {
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 20px rgba(0,0,0,0.15);
    }

    .contact-footer {
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
      border-radius: 8px;
      font-size: 1rem;
      font-weight: 500;
      text-decoration: none;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .btn-primary {
      background: linear-gradient(135deg, #007bff, #0056b3);
      color: white;
    }

    .btn-primary:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 4px 15px rgba(0,123,255,0.3);
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
      .contact-container {
        padding: 1rem;
      }

      .contact-content {
        grid-template-columns: 1fr;
        gap: 2rem;
      }

      .form-row {
        grid-template-columns: 1fr;
      }

      .contact-header h1 {
        font-size: 2rem;
      }

      .info-card {
        padding: 1rem;
      }

      .contact-form-section {
        padding: 1.5rem;
      }
    }
  `]
})
export class ContactComponent implements OnInit {
  contactForm!: FormGroup;
  isSubmitting = signal(false);
  showSuccessMessage = signal(false);
  showErrorMessage = signal(false);

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {
    emailjs.init('BAccsEXwD3PwquwVP');
  }

  ngOnInit() {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      subject: ['', Validators.required],
      message: ['', [Validators.required, Validators.minLength(10)]],
      acceptPrivacy: [false, Validators.requiredTrue]
    });
  }

  async onSubmit() {
    if (this.contactForm.valid) {
      this.isSubmitting.set(true);
      this.showSuccessMessage.set(false);
      this.showErrorMessage.set(false);
      
      try {
        await this.sendContactEmail();
        this.showSuccessMessage.set(true);
        this.contactForm.reset();
        
        setTimeout(() => {
          this.showSuccessMessage.set(false);
        }, 5000);
        
      } catch (error) {
        console.error('Error al enviar consulta:', error);
        this.showErrorMessage.set(true);
        
        setTimeout(() => {
          this.showErrorMessage.set(false);
        }, 5000);
      } finally {
        this.isSubmitting.set(false);
      }
    } else {
      Object.keys(this.contactForm.controls).forEach(key => {
        this.contactForm.get(key)?.markAsTouched();
      });
    }
  }

  private async sendContactEmail() {
    const formData = this.contactForm.value;
    
    const subjectMap: { [key: string]: string } = {
      'cotizacion': 'Consulta sobre Cotización',
      'poliza': 'Consulta sobre Póliza Existente',
      'siniestro': 'Consulta sobre Siniestro',
      'renovacion': 'Renovación de Póliza',
      'general': 'Consulta General',
      'reclamo': 'Reclamo'
    };

    const templateParams = {
      from_name: formData.name,
      from_email: formData.email,
      phone: formData.phone || 'No proporcionado',
      subject_type: subjectMap[formData.subject] || formData.subject,
      message: formData.message,
      to_email: 'davidroman.desarrollador@gmail.com',
      reply_to: formData.email,
      date: new Date().toLocaleDateString('es-AR')
    };

    console.log('📧 Enviando consulta de contacto:', templateParams);

    const result = await emailjs.send(
      'service_v7j4gct',
      'template_5ev5u7a',
      templateParams
    );

    console.log('✅ Consulta enviada exitosamente:', result);
    return result;
  }

  goBack() {
    this.router.navigate(['/']);
  }
}