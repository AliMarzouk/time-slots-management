import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JsonFileReader } from './json-file-reader';

describe('JsonFileReader', () => {
  let component: JsonFileReader;
  let fixture: ComponentFixture<JsonFileReader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JsonFileReader]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JsonFileReader);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
