/**************
 * RB-CHECKBOX
 **************/
import { RbBase, props, html } from '../../rb-base/scripts/rb-base.js';
import FormControl             from '../../form-control/scripts/form-control.js';
import Type                    from '../../rb-base/scripts/public/services/type.js';
import template                from '../views/rb-checkbox.html';
import '../../rb-popover/scripts/rb-popover.js';

export class RbCheckbox extends FormControl(RbBase()) {
	/* Lifecycle
	 ************/
	constructor() {
		super();
		this.state = {
			...super.state,
			value: undefined
		}
	}
	viewReady() { // :void
		super.viewReady && super.viewReady();
		Object.assign(this.rb.formControl, {
			elm:      this.shadowRoot.querySelector('input'),
			focusElm: this.shadowRoot.querySelector('.sublabel'),
		});
		this._initSlotStates(); // see rb-base: private/mixins/slot.js
	}

	/* Properties
	 *************/
	static get props() { // :object
		return {
			...super.props,
			kind: props.string,
			label: props.string,
			inline: props.boolean,
			horizontal: props.boolean,
			right: props.boolean,
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
						case /^-?\d*\.?\d*$/.test(val): // number
							newVal = parseFloat(val)
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
		if (typeof(value) !== 'boolean' && value !== undefined) return this.value = null;
		if (typeof(value) === 'boolean') return this.value = !value;
		if (props.value === undefined && this.state.value === undefined) return this.value = !this.value;
		this.value = this.state.value;
	}

	/* Observer
	 ***********/
	updating(prevProps) { // :void
		if (prevProps.value === this.value) return;
		this.rb.events.emit(this, 'value-changed', {
			detail: { value: this.value }
		});
	}

	updated(prevProps, prevState) {
		super.updated && super.updated(prevProps, prevState);
		if (!!this.state.value) return;
		this.state.value = this.value;
	}

	/* Event Handlers
	 *****************/
	_onchange(evt) { // :void
		this.rb.events.emit(this, 'change', {
			detail: { value: this.value }
		});
	}
	async _onclick(value, evt) { // :void
		this.setValue(value);
		await this.validate();
		this._onchange(evt);
	}
	async _onkeypress(value, evt) { // :void
		const keys = ['enter','space'];
		const key  = this.getKey(evt.code);
		if (keys.indexOf(key) === -1) return;
		evt.preventDefault(); // prevent space key from moving page down
		this.setValue(value);
		await this.validate()
		this.rb.formControl.elm.checked = this.value; // needed for firefox
		this._onchange(evt);
	}

	/* Template
	 ***********/
	render({ props, state }) { // :string
		return html template;
	}
}

customElements.define('rb-checkbox', RbCheckbox);
