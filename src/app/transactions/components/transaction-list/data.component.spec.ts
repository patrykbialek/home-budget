import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataComponent } from './data.component';
import { Transaction } from '@transactions/models';
import { SimpleChange } from '@angular/core';
import { WindowSize } from '@shared/models';

fdescribe('DataComponent', () => {
  let component: DataComponent;
  let fixture: ComponentFixture<DataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DataComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it(`should call 'emit' method on 'deleteTransaction' when 'onDelete' method is called`, () => {
    const item = {
      account: null,
      amount: null,
      category: null,
      date: null,
      inBugdet: null,
      key: '1',
      recipient: null,
      type: null,
    } as Transaction;
    const deleteTransactionEmitSpy = spyOn(component.deleteTransaction, 'emit');

    component.onDelete(item);
    expect(deleteTransactionEmitSpy).toHaveBeenCalledWith('1');
  });

  it(`should set 'displayedColumnsForDesktopSize' when window size equals to 'desktop'`, () => {
    component.windowSize = WindowSize.Desktop;

    component.ngOnChanges({
      windowSize: new SimpleChange('mobile', component.windowSize, false)
    });
    fixture.detectChanges();

    expect(component.displayedColumns).toEqual(component.displayedColumnsForDesktopSize);
  });

  it(`should set 'displayedColumnsForMobileSize' when window size equals to 'mobile'`, () => {
    component.windowSize = WindowSize.Mobile;

    component.ngOnChanges({
      windowSize: new SimpleChange('desktop', component.windowSize, false)
    });
    fixture.detectChanges();

    expect(component.displayedColumns).toEqual(component.displayedColumnsForMobileSize);
  });
});
