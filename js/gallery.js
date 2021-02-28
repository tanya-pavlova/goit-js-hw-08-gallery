
import gallery from './gallery-items.js'

const refs = {
	galleryRef: document.querySelector('.js-gallery'),
	modalRef: document.querySelector('div.lightbox'),
	closeModalRef: document.querySelector('button.lightbox__button'),
	overlayRef: document.querySelector('.lightbox__overlay'),
	modalImgRef: document.querySelector('.lightbox__image'),
}

const galleryMarkup = createGalleryMarkup(gallery);
 refs.galleryRef.insertAdjacentHTML('beforeend', galleryMarkup);

function createGalleryMarkup(gallery) {
	let i = 0;
	return gallery.map(({preview, original, description}) => {
	return `<li class="gallery__item">
  	<a class="gallery__link" href="${original}">
    <img
      class="gallery__image"
      src="${preview}"
      data-source="${original}"
      data-index ="${(i += 1)}"
      alt="${description}"
    />
	</a>
	</li>`;
  })
  .join('');
}

refs.galleryRef.addEventListener('click', onGalleryClick)

function setOriginalImageSrc(url) {
	refs.modalImgRef.src = url
}

function onGalleryClick(event) {
	event.preventDefault()
	
	if (event.target.nodeName !== 'IMG') {
		return
	}
	
	refs.modalRef.classList.add('is-open')

	
	const originalImageRef = event.target.dataset.source
	setOriginalImageSrc(originalImageRef)

	refs.closeModalRef.addEventListener('click', onCloseModalBtnClick)
	window.addEventListener('keydown', onEscCloseModal)
	window.addEventListener('keydown', scrollImgs)
	refs.overlayRef.addEventListener('click', onOverlayClick)
}

function onCloseModalBtnClick() {
	window.removeEventListener('keydown', onEscCloseModal);
	refs.modalRef.classList.remove('is-open');	
	refs.modalImgRef.src = '';
}
  
function onEscCloseModal(event) {
	if (event.code === 'Escape') {
		onCloseModalBtnClick()
	}
}

function onOverlayClick(event) {
	
	if (event.target === event.currentTarget) {
		onCloseModalBtnClick()
	}
}

function scrollImgs(event) {
	
	if (!refs.modalRef.classList.contains('is-open')) {
		return
	}

	const imgRefs = refs.galleryRef.querySelectorAll('img')
	
	const currentImg = [...imgRefs].find(
		arrImg => arrImg.dataset.source === refs.modalImgRef.src,
	)
	
	const currentIndex = Number(currentImg.dataset.index)
	
	if (event.code === 'ArrowRight') {
		
		if (currentIndex + 1 === imgRefs.length) {
			onCloseModalBtnClick()
		}
		
		const nextImg = [...imgRefs].find(
			arrImg => Number(arrImg.dataset.index) === currentIndex + 1,
		)
		refs.modalImgRef.src = nextImg.dataset.source
	}

	if (event.code === 'ArrowLeft') {
		
		if (currentIndex - 1 === 0) {
			onCloseModalBtnClick()
		}

		const previousImg = [...imgRefs].find(
			arrImg => Number(arrImg.dataset.index) === currentIndex - 1,
		)
		refs.modalImgRef.src = previousImg.dataset.source
	}
}