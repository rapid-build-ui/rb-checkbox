/**************
 * RB-CHECKBOX
 **************/
import { props, html, RbBase } from '../../rb-base/scripts/rb-base.js';
import FormControl from '../../form-control/scripts/form-control.js';
import Type from '../../rb-base/scripts/type-service.js';
import template from '../views/rb-checkbox.html';

export class RbCheckbox extends FormControl(RbBase()) {
	/* Lifecycle
	 ************/
	viewReady() { // :void
		super.viewReady && super.viewReady();
		Object.assign(this.rb.elms, {
			focusElm:    this.shadowRoot.querySelector('.sublabel'),
			formControl: this.shadowRoot.querySelector('input')
		});
	}
	updated(prevProps, prevState) { // :void (runs before viewReady())
		if (super.updated) super.updated(prevProps, prevState);
		if (!this.rb.view.isReady) return;
		if (prevProps.value === this.value) return;
		// runs after view updated (required)
		this.rb.events.emit(this, 'value-changed', {
			detail: { value: this.value }
		});
	}

	/* Properties
	 *************/
	static get props() { // :object
		return {
			...super.props,
			kind: props.string,
			label: props.string,
			sublabel: props.string,
			subtext: props.string,
			value: Object.assign({}, props.any, {
				deserialize(val) { // :boolean | string | object
					val = Type.is.string(val) ? val.trim() : val;
					let newVal;
					switch (true) {
						case /^(?:true|false)$/i.test(val): // boolean
							newVal = /^true$/i.test(val);
							break;
						case /^{[^]*}$/.test(val): // object
							newVal = JSON.parse(val);
							break;
						default:  // string
							newVal = val;
					}
					return newVal;
				}
			})
		};
	}

	/* Helpers
	 **********/
	getKey(code) { // :string | undefined
		if (!code) return;
		return code.toLowerCase();
	}
	async setValue(value) { // :void
		this.value = !value;
		await this.validate();
	}

	/* Event Handlers
	 *****************/
	_onclick(value, evt) { // :void
		this.setValue(value);
	}
	_onkeypress(value, evt) { // :void
		const keys = ['enter','space'];
		const key  = this.getKey(evt.code);
		if (keys.indexOf(key) === -1) return;
		evt.preventDefault(); // prevent space key from moving page down
		this.setValue(value);
		this.rb.elms.formControl.checked = this.value; // needed for firefox
	}

	/* Template
	 ***********/
	render({ props }) { // :string
		return html template;
	}
}

customElements.define('rb-checkbox', RbCheckbox);
