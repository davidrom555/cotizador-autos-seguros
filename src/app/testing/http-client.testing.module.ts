import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ApplicationConfig, importProvidersFrom } from '@angular/core';

export const httpClientTestingProviders = [
  provideHttpClient(),
  provideHttpClientTesting(),
];