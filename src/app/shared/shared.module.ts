
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NetworkErrorModalComponent } from './components/network-error-modal/network-error-modal.component';
import { ContactComponent } from './components/contact/contact';
import { PrivacyPolicyComponent } from './components/privacy-policy/privacy-policy';
import { TermsConditionsComponent } from './components/terms-conditions/terms-conditions';

@NgModule({
  imports: [
    CommonModule,
    NetworkErrorModalComponent,
    ContactComponent,
    PrivacyPolicyComponent,
    TermsConditionsComponent
  ],
  exports: [
    NetworkErrorModalComponent,
    ContactComponent,
    PrivacyPolicyComponent,
    TermsConditionsComponent
  ]
})
export class SharedModule {}
