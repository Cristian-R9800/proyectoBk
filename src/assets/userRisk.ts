export const getbody = (name: string, latitud:number, longitud:number): string => {
    return `
    
    <h1> USER ${name} IN RISK actual login location is </h1> 
    <ul>
      <li>latitud: ${latitud}</li>
      <li>longitud: ${longitud}</li>
    </ul> 
    
    <a href="https://maps.google.com/?q=${latitud},${longitud}">Verifica la ubicación del ultimo ingreso</a>
    
    
    `;
};