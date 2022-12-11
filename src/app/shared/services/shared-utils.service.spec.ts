import { TestBed, inject } from '@angular/core/testing';
import { SharedUtilsService } from './shared-utils.service';
import { WindowSize } from '@shared/models';

fdescribe('SharedUtilsService', () => {
  let service: SharedUtilsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SharedUtilsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('when setIsMobileSize', whenSetIsMobileSize);
});

function whenSetIsMobileSize() {
  let service: SharedUtilsService;

  beforeEach(inject([],
    () => {
      service = new SharedUtilsService();
    }));

  it(`should call set windowSize value`, () => {
    service.setIsMobileSize(WindowSize.Desktop);

    service.windowSize$
      .subscribe(response => {
        expect(response).toBe('desktop');
      });
  });
}
