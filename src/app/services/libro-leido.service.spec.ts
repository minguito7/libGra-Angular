import { TestBed } from '@angular/core/testing';

import { LibroLeidoService } from './libro-leido.service';

describe('LibroLeidoService', () => {
  let service: LibroLeidoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LibroLeidoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
