import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { signal } from '@angular/core';
import emailjs from '@emailjs/browser';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
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