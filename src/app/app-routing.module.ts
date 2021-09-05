import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SimulacionComponent } from './simulacion/simulacion.component';


const routes: Routes = [{
  path: "",
  component:SimulacionComponent
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
