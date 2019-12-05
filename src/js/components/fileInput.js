/**
 * Copyright (C) 2018 The Trustees of Indiana University
 * SPDX-License-Identifier: BSD-3-Clause
 */

import dispatchCustomEvent from '../utilities/dispatchCustomEvent';

export default class FileInput {
  constructor(element, options) {
    const defaultOptions = {
      previewText: 'No file selected'
    };

    const settings = {
      ...defaultOptions,
      ...options
    };

    this.element = element;
    this.wrapperAttribute = 'data-upload-wrapper';
    this.inputAttribute = 'data-upload-input';
    this.previewAttribute = 'data-upload-preview';
    this.previewText = settings.previewText;

    this._handleChange = this._handleChange.bind(this);

    this.init();
  }

  /*!
   * Sanitize and encode all HTML in a user-submitted string
   * (c) 2018 Chris Ferdinandi, MIT License, https://gomakethings.com
   * @param  {String} str  The user-submitted string
   * @return {String} str  The sanitized string
   */
  _sanitizeHTML(str) {
    const temp = document.createElement('div');
    temp.textContent = str;
    return temp.innerHTML;
  }

  /**
   *
   * @param {HTMLInputElement} input - HTML file input
   * @return {HTMLSpanElement} - A span containing the file name that was
   * attached to the file input
   */
  _buildSingleFile(input) {
    // Create <span> element to display our file name
    const singleFileItem = document.createElement('span');

    /**
     * Sanitize use input here just incase someone would make the
     * name of their file a malicious script.
     */
    const singleFileName = this._sanitizeHTML(input.files[0].name);

    // Add the file name as the text content
    singleFileItem.textContent = singleFileName;

    const singleFileEvent = dispatchCustomEvent(
      'buildSingleFile',
      this.element,
      {
        type: 'single',
        fileName: singleFileName,
        fileInputWrapper: this.element.dataset.uploadWrapper
      }
    );

    if (!singleFileEvent) return;

    // Returns our built <span> element.
    return singleFileItem;
  }

  /**
   *
   * @param {HTMLInputElement} input - HTML file input
   * @return {HTMLSpanElement} - A span containing the a description
   * of the number of files attached to file input
   */
  _buildMultipleFiles(input) {
    const fileCount = document.createElement('span');
    fileCount.textContent = input.files.length + ' files selected';

    const multipleFilesEvent = dispatchCustomEvent(
      'buildMultipleFiles',
      this.element,
      {
        type: 'multiple',
        numberOfFiles: input.files.length,
        fileInputWrapper: this.element.dataset.uploadWrapper
      }
    );

    if (!multipleFilesEvent) return;

    return fileCount;
  }

  /**
   *
   * @param {Event} event - Handles the main 'change' event emitted when
   * file(s) are attached to the file input
   */
  _handleChange() {
    // The actual input element
    const uploadInput = this.element.querySelector(`[${ this.inputAttribute }]`);

    // The preview element where we'll inject file count, etc.
    const uploadPreview = this.element.querySelector(`[${ this.previewAttribute }]`);

    // Check to make sure that at least one file was attached
    if (uploadInput.files.length > 0) {
      // Set remove the preview element placeholder text
      uploadPreview.innerHTML = '';

      /**
       * If there is more than one file attached, build up a span
       * that shows the file count to insert into the preview element,
       * otherwise show the file name that was uploaded.
       */
      uploadInput.files.length > 1 ?
        uploadPreview.appendChild(this._buildMultipleFiles(uploadInput)) :
        uploadPreview.appendChild(this._buildSingleFile(uploadInput));
    } else {
      /**
       * If no files were attached set the placeholder text back
       * to the default
       */
      uploadPreview.innerHTML = this.previewText;
    }
  }

  /**
   * @param {HTMLElement} context - An optional DOM element that the
   * file input can be initialized on. All event listeners will be attached
   * to this element. Usually best to just leave it to default
   * to the document.
   */
  init() {
    this.element.addEventListener('change', this._handleChange, false);
  }

  /**
   * @param {HTMLElement} context - An optional DOM element. This only
   * needs to be passed in if a DOM element was passed to the init()
   * function. If so, the element passed in must be the same element
   * that was passed in at initialization so that the event listeners can
   * be properly removed.
   */
  destroy() {
    this.element.removeEventListener('change', this._handleChange, false);
  }
}