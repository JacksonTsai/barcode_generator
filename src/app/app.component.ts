import { Component, HostListener } from '@angular/core';
import * as JsBarcode from 'jsbarcode';

interface PreviewContent {
  id: string;
  filename: string;
  invoiceNO: string;
  // barcodeObject: { id: string; code: string };
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  selectedFiles: File[] = [];
  previewContent: PreviewContent[] = [];
  @HostListener('change', ['$event.target.files']) emitFiles(event: FileList) {
    if (event) {
      this.selectedFiles = Array.from(event);
    }
  }

  previewFiles() {
    this.selectedFiles.map((file) => {
      this.fileReader(file);
    });
  }

  removeFile(file) {
    const newFileList = this.selectedFiles.filter((d) => d.name !== file.name);
    this.selectedFiles = newFileList;
  }

  private async fileReader(file: File) {
    const fileReader = new FileReader();
    fileReader.onerror = (e) => console.log(`${file.name} load fail(${e})`);
    fileReader.onload = (d) => {
      this.fileContext(file.name, d);
    };
    await fileReader.readAsText(file);
  }

  private fileContext = (filename, data) => {
    const code = this.getInvoiceNO(data.target.result);
    this.previewContent.push({
      id: `barcode_${code}`,
      filename,
      invoiceNO: code,
    });
    setTimeout(() => {
      this.generterBarcode(`#barcode_${code}`, code);
    }, 0);
  };

  private getInvoiceNO(data: string) {
    const temp = data.split(/: |  /);
    const invoiceIdx = temp.findIndex((d) => d.includes('INVOICE NO'));
    return temp[invoiceIdx + 1].trim();
  }

  generterBarcode(id, code: string) {
    JsBarcode(id, code, {
      lineColor: '#000',
      width: 1,
      height: 40,
      displayValue: true,
    });
  }
}
