import { CollapsibleEntry } from '@bpmn-io/properties-panel';
import { h } from '@bpmn-io/properties-panel/preact';
import { useService } from '../../../utils';

const TYPE_OPTIONS = [
  'String',
  'Boolean',
  'Double',
  'Decimal',
  'Long',
  'Custom',
  'Date',
  'DateTime',
  'UUID',
  'Int',
];

function FieldsEditor(props) {
  const { element } = props;
  const modeling = useService('modeling');

  const fields = Array.isArray(element.businessObject.fields)
    ? element.businessObject.fields
    : [];

  function updateField(index, key, value) {
    const next = fields.map((f, i) => (i === index ? { ...f, [key]: value } : f));
    modeling.updateProperties(element, { fields: next });
  }

  function removeField(index) {
    const next = fields.filter((_, i) => i !== index);
    modeling.updateProperties(element, { fields: next });
  }

  function addField() {
    const id = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const next = [...fields, { _id: id, name: '', type: 'String', example: '' }];
    modeling.updateProperties(element, { fields: next });
  }

  return (
    h('div', { class: 'bio-properties-panel-list', style: { display: 'grid', gap: '8px' } }, [
      ...fields.map((field, index) => (
        h('div', { key: field._id || index, class: 'bio-properties-panel-row', style: { display: 'grid', gridTemplateColumns: '2fr 80px 2fr auto', gap: '8px', alignItems: 'center' } }, [
          // name
          h('input', {
            class: 'bio-properties-panel-input',
            type: 'text',
            placeholder: 'name',
            defaultValue: field.name || '',
            onBlur: (e) => updateField(index, 'name', e.target.value),
            onKeyDown: (e) => { if (e.key === 'Enter') { e.preventDefault(); updateField(index, 'name', e.target.value); } },
          }),
          // type select
          h('select', {
            class: 'bio-properties-panel-input',
            value: field.type || 'String',
            onChange: (e) => updateField(index, 'type', e.target.value),
            style: { width: '100%' },
          }, TYPE_OPTIONS.map((opt) => h('option', { value: opt }, opt))),
          // example
          h('input', {
            class: 'bio-properties-panel-input',
            type: 'text',
            placeholder: 'example',
            defaultValue: field.example || '',
            onBlur: (e) => updateField(index, 'example', e.target.value),
            onKeyDown: (e) => { if (e.key === 'Enter') { e.preventDefault(); updateField(index, 'example', e.target.value); } },
          }),
          // remove button
          h('button', {
            class: 'bio-properties-panel-button',
            onClick: () => removeField(index),
            title: 'Remove field',
            'aria-label': 'Remove field',
            style: { padding: '0 6px', minWidth: '28px', height: '28px', lineHeight: '28px' },
          }, '🗑'),
        ])
      )),
      h('div', null,
        h('button', {
          class: 'bio-properties-panel-button',
          onClick: addField,
          style: { padding: '6px 10px', marginTop: '4px' },
        }, 'Add Field')
      ),
    ])
  );
}

export default function FieldsProps(props) {
  const { element } = props;

  const entry = {
    id: 'fields-editor',
    element,
    component: FieldsEditor,
  };

  return [
    {
      component: () => CollapsibleEntry({ id: 'collapsible-fields', label: 'Fields', element, entries: [entry], open: true }),
      isEdited: () => false,
    },
  ];
}


