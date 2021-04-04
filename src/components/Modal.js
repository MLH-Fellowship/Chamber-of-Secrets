import React from 'react'
import ReactDom from 'react-dom'
import './modal.scss'

export default function Modal ({onClose}) {
    return ReactDom.createPortal(
    <>
    <div id="modal-container">
        <div class="modal-background">
            <div class="modal">
                <h2>I'm a Modal</h2>
                <button onClick={onClose}>Close Modal</button>
                <p>Hear me roar.</p>
                <svg class="modal-svg" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" preserveAspectRatio="none">
				<rect x="0" y="0" fill="none" width="226" height="162" rx="3" ry="3"></rect>
				</svg>
            </div>
        </div>
    </div>
    </>,
    document.getElementById('portal')
    )
}