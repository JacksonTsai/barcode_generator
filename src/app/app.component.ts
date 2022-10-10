import { Component, HostListener, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import html2canvas from 'html2canvas';
import * as JsBarcode from 'jsbarcode';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  selectedFilename: string[] = [];
  inputInvoice = new FormControl('');
  @ViewChild('filesInput') filesInput;

  @HostListener('change', ['$event.target.files']) emitFiles(event: FileList) {
    if (event) {
      Array.from(event).map((d) => {
        const filename = d.name.split('.')[0];
        if (this.selectedFilename.includes(filename)) {
          return;
        }
        this.selectedFilename.push(filename);
      });
      this.selectedFilename.map((id) => {
        setTimeout(() => {
          this.generterBarcode(id);
        }, 0);
      });
      this.filesInput.nativeElement.value = null;
    }
  }

  clearAll() {
    this.selectedFilename = [];
  }

  removeFile(id) {
    const newFileList = this.selectedFilename.filter((d) => d !== id);
    this.selectedFilename = newFileList;
  }

  addinvoice() {
    if (!this.inputInvoice.value) {
      return;
    }

    const inputInvoiceList = this.inputInvoice.value
      .split(/,|;|\/| |\r?\n/)
      .filter((d) => d ?? false);
    const newinputInvoice = inputInvoiceList.filter((d) =>
      this.selectedFilename.includes(d) ? false : true
    );
    this.selectedFilename.push(...newinputInvoice);
    this.inputInvoice.setValue('');
    newinputInvoice.map((d) => {
      setTimeout(() => {
        this.generterBarcode(d);
      }, 0);
    });
  }

  generterBarcode(id: string) {
    if (id.length !== 12) {
      return;
    }
    JsBarcode(`#barcode_${id}`, id, {
      lineColor: '#000',
      width: 1,
      height: 40,
      displayValue: true,
    });
  }

  formatAMPM() {
    const date = new Date();
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    var strTime = `${hours}_${minutes}_${seconds}_${day}`;
    return strTime;
  }

  export() {
    let DATA: any = document.getElementById('export-context');
    html2canvas(DATA).then((canvas) => {
      let fileWidth = 208;
      let fileHeight = (canvas.height * fileWidth) / canvas.width;
      const FILEURI = canvas.toDataURL('image/png');
      let PDF = new jsPDF('p', 'mm', 'a4');
      let position = 0;
      PDF.addImage(FILEURI, 'PNG', 0, position, fileWidth, fileHeight);
      PDF.save(`${this.formatAMPM()}.pdf`);
    });
  }
}
