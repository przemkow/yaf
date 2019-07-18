import { vComponent } from './models';

function createVComponent(type: Function, props): vComponent {
  return { 
    type, 
    props: {
      ...props,
    }  
  };
}

export {
  createVComponent
}