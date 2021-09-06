import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import {
  INDEX_STATE,
  INDEX_VALUE_1,
  INDEX_VALUE_2,
  INDEX_DIRECTION,
  INDEX_NEXT_STATE,
  MAX_ITERATIONS
} from '../../variables';
@Component({
  selector: 'app-simulacion',
  templateUrl: './simulacion.component.html',
  styleUrls: ['./simulacion.component.scss']
})
export class SimulacionComponent implements OnInit {


  public form: FormGroup;
  private arrayQuintuplas: any[] = [];
  private cinta: string;
  private chartListCinta: string[] = [];
  private indexCinta: number = 0;
  private actualState:string;
  private finalText =""; 
 
  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      cinta: new FormControl(''),
      quintuplas: new FormControl('0 _ 1 r 1\n1 _ 1 r 2\n2 _ 1 r 3\n3 _ _ l 2\n2 1 _ l 1\n1 1 _ l 0\n0 1 _ r 0'),
      result: new FormControl(''),
    }); 
  }

  execute() {
    this.initVariables();
    this.executeIterations();

  }

  executeIterations() {
    var finished = 0;
    try {
      this.executInitialSteep();
      while (finished<MAX_ITERATIONS) {
        this.executSteep();
        // this.goToNextState();
  
        finished ++;
      }
    } catch (ex) {
      let value = this.chartListCinta.toString();
      this.form.controls["result"].setValue(value);
      console.log("terminado");
      
    }
 
  }

  initVariables() {
    this.arrayQuintuplas = [];
    this.chartListCinta  = [];
    this.finalText =  "";
    this.cinta = this.form.controls["cinta"].value;
 
 
    this.setInitialIndex();
    this.buildCintaVariables();
    var rows = this.converLinesToStringList();
    // ['1 0 3 2 2', '1 2 3 4 6']
    console.log("rows", rows);

    rows.forEach(row => {
      var tuplas = this.convertLineToTuplasList(row);
      // ['1', '0', '0', '1', '2']
      console.log("tuplas", tuplas);

      this.arrayQuintuplas.push(tuplas);
    });

    // [['1', '0', '0', '1', '2'],['1', '0', '0', '1', '2']]
    console.log("arrayQuintuplas", this.arrayQuintuplas);

  }
  converLinesToStringList() {
    var quintuplas = this.form.controls["quintuplas"].value;
    return quintuplas.split("\n");
  }

  convertLineToTuplasList(row) {
    var tuplas = row;
    return tuplas.split(" ");
  }

  setInitialIndex() {
    let index = this.cinta.indexOf("*");
    this.indexCinta = (index == -1) ? 0 : index;

    
  }

  buildCintaVariables() {
    this.cinta = this.cinta.replace(/\s/g, "_");
    this.cinta = this.cinta.replace(/\*/g, "");
    this.cinta = this.cinta==""?"_":this.cinta;

    for (let i = 0; i < this.cinta.length; i++)
      this.chartListCinta.push(this.cinta[i]);

    
  }

  executInitialSteep() {
    
    let char = this.chartListCinta[this.indexCinta];
    
    let indexTupla = this.arrayQuintuplas.findIndex(x => x[INDEX_VALUE_1] == char);
 

    let tupla = this.arrayQuintuplas[indexTupla];

    let newChar = tupla[INDEX_VALUE_2];
    this.chartListCinta[this.indexCinta] = newChar;
    this.indexCinta = tupla[INDEX_DIRECTION]=="r"?this.indexCinta+1:this.indexCinta-1;
 
    this.actualState = tupla[INDEX_NEXT_STATE];

    this.finalText += this.getIterationText();

    this.form.controls["result"].setValue(this.finalText);
      
  }

  getIterationText(){
    var text = "\n"+this.chartListCinta.toString();
    var text = text.replace(/_/g,"").replace(/,/g,"");
    return  text;
  }
  executSteep() {
    let char = this.chartListCinta[this.indexCinta]==undefined ? "_" : this.chartListCinta[this.indexCinta];
    let indexTupla = this.arrayQuintuplas.findIndex(x => x[INDEX_VALUE_1] == char && x[INDEX_STATE]==this.actualState);
    let tupla = this.arrayQuintuplas[indexTupla];

    let newChar = tupla[INDEX_VALUE_2];

    // this.addChartToCinta(newChar,tupla);
    this.chartListCinta[this.indexCinta] = newChar;
    this.indexCinta = tupla[INDEX_DIRECTION]=="r"?this.indexCinta+1:this.indexCinta-1;
 
    this.actualState = tupla[INDEX_NEXT_STATE];

     
    this.finalText += this.getIterationText();
    this.form.controls["result"].setValue(this.finalText);
  }
  goToNextState() {
  
    
  }
  addChartToCinta(newChar,tupla)
  {
    var chart = this.getChar(newChar,tupla);
    if(chart!="")
      this.chartListCinta[this.indexCinta] = chart;

    
  }
  getChar(newChar, tupla){
    if(newChar=="_"){
      if(tupla[INDEX_DIRECTION]=="r")
        this.indexCinta--;

        else
        this.indexCinta++;

        return "";
    }
    return newChar;
  }


}
