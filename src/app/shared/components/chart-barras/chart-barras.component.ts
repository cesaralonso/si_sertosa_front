import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { CommonService } from '../../services/common.service';
import * as Chart from 'chart.js';
declare var html2pdf;


@Component({
  selector: 'app-chart-barras',
  templateUrl: './chart-barras.component.html',
  styleUrls: ['./chart-barras.component.scss']
})
export class ChartbarrasComponent {

  @Input()
  set data(data) {
    
    this._data = [];
    this._semana = [];
    this._charType = '';
    this._data = data[0];
    this._semana = data[1];
    this._charType = data[2];
    if (this._data && this._semana) {
      this.refill();
    }
  }
  get data() { return this._data; }
  _data: any[];

  @ViewChild('element')
  element: any;

  _semana: string[];
  _charType: string;

  constructor(private commonService: CommonService) {
  }

  showGrafica(etiquetas, data) {
    /* 
      data = {
        semana: 52,
        data: [
          {
            value: totalAventajado,
            label: 'Aventajado',
            order: 7
          }
        ],
        rgbColorSolid = 'rgba(1,2,3, 1)';
        rgbColorAlpha = 'rgba(1,2,3, 0.2)';
      }
    */
    var ctx = this.element.nativeElement.getContext('2d'); 

    // Se integra la data
    const _datasets = [];
    data.forEach(set => {
      
      const _label = set.semana;
      const _arrayData = [];
      set.data.map(_data => {
        _arrayData.push(_data.value);
      });
      const _data = _arrayData;
      const _backgroundColor = [];
      const _borderColor = [];

      etiquetas.forEach(() => { 
        _backgroundColor.push(set.rgbColorAlpha);
        _borderColor.push(set.rgbColorSolid);
      });

      const _set = {
        label: _label,
        data: _data,
        backgroundColor: _backgroundColor,
        borderColor: _borderColor,
        borderWidth: 1
      }

      _datasets.push(_set);
    });

    const grafica = new Chart(ctx, {
        type: this._charType,
        data: {
            labels: etiquetas,
            datasets: _datasets
        }
    });
    
  }

  refill() {
    const setData = this._data;

    // SEMANA
    if (setData[0]) {
      setData.map(set => {
        // Generar colores para gráfica
        const _color = Math.floor(Math.random() * 255) + ', ' + Math.floor(Math.random() * 255) + ', ' + Math.floor(Math.random() * 255);
        set.rgbColorSolid = 'rgba(' + _color + ', 1)';
        set.rgbColorAlpha = 'rgba(' + _color + ', 0.2)';
      });

      const etiquetas = [];
      setData[0].data.map(_data => {
        etiquetas.push(_data.label);
      });

      this.showGrafica(etiquetas, setData);
    }
  }   
  
  descargarCSV() {
    console.log('_data', this._data);
    this.commonService.JSONToCSVConvertor(this._data[0].data, 'Reporte Semanas ' + this._semana, true);
  }

  async descargaPdf() {
    var opt = {
      margin:       0.5,
      filename:     `Reporte Semanas ${this._semana}.pdf`,
      image:        { type: 'jpeg', quality: 1.0 },
      html2canvas:  { scale: 1 },
      jsPDF:        { unit: 'in', format: 'letter', orientation: 'landscape' }
    };
    // New Promise-based usage:
    await html2pdf().set(opt).from(this.element.nativeElement).save();
  }

}
