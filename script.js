document.addEventListener('DOMContentLoaded', () => {

  const filtroBotones = document.querySelectorAll('.filtro-btn');
  const tarjetaMenu = document.querySelectorAll('.plato-card');

  const filterMenu = (selectedCategory) => {
    filtroBotones.forEach(button => {
      if (button.dataset.category === selectedCategory) {
        button.classList.add('activo'); 
      } else {
        button.classList.remove('activo'); 
      }
    });

    tarjetaMenu.forEach(card => {
      const categoriaTarjeta = card.dataset.category;
      
      if (categoriaTarjeta === selectedCategory) {
        card.style.display = 'block';
      } else {
        card.style.display = 'none';
      }
    });
  };

  filtroBotones.forEach(button => {
    button.addEventListener('click', () => {
      const categoria = button.dataset.category; 
      filterMenu(categoria); 
    });
  });

  filterMenu('pollo');
});