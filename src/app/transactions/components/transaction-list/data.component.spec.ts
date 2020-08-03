import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataComponent } from './data.component';
import { Transaction } from '@transactions/models';

fdescribe('DataComponent', () => {
  let component: DataComponent;
  let fixture: ComponentFixture<DataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataComponent ]
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
});
