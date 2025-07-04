import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
@Component({
  standalone: true,
  selector: 'app-json-file-reader',
  imports: [MatIconModule, MatButtonModule],
  templateUrl: './json-file-reader.html',
})
export class JsonFileReader {
  @Input() label = 'Choose your json file';
  @Input() id = 0;
  @Input() jsonValidationFunction: ((data: any) => void) | undefined;

  @Output() jsonLoaded = new EventEmitter<any>();

  fileName: string = '';

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input && input.files && input.files[0]) {
      const file: File = input.files[0];

      this.fileName = file.name;

      const reader = new FileReader();
      reader.onload = this.onReaderLoad;
      reader.readAsText(file);
    }
  }

  onReaderLoad = (event: any) => {
    try {
      const json = JSON.parse(event.target.result);
      this.jsonValidationFunction && this.jsonValidationFunction(json);
      this.jsonLoaded.emit({
        id: this.id,
        data: json,
      });
    } catch (e) {
      this.fileName = '';
      console.error(e);
    }
  };
}
