import { Component } from 'react';
import PropTypes from 'prop-types';
import { v4 as uuidv4 } from 'uuid';

import Section from './components/Section';
import Container from './components/Container';
import ContactForm from './components/ContactForm';
import ContactList from './components/ContactsList';
import Filter from './components/Filter';

class App extends Component {
  state = {
    contacts: [
      { id: 'id-1', name: 'Rosie Simpson', number: '459-12-56' },
      { id: 'id-2', name: 'Hermione Kline', number: '443-89-12' },
      { id: 'id-3', name: 'Eden Clements', number: '645-17-79' },
    ],
    filter: '',
  };

  onFormSubmit = data => {
    const isDuplicateNumber = this.state.contacts.find(
      ({ number }) => number === data.number,
    );
    if (isDuplicateNumber) {
      alert('This number is already in contacts.');
      return;
    }
    data.id = uuidv4();
    this.setState(prevState => ({
      contacts: [data, ...prevState.contacts],
    }));
  };

  onFilterChange = e => {
    this.setState({
      filter: e.currentTarget.value,
    });
  };

  getVisibleContacts = () => {
    const { contacts, filter } = this.state;
    const normalizedFilter = filter.toLowerCase();

    return contacts.filter(({ name }) =>
      name.toLowerCase().includes(normalizedFilter),
    );
  };

  onDeleteContact = id => {
    this.setState(prevState => ({
      contacts: prevState.contacts.filter(contact => contact.id !== id),
    }));
  };

  componentDidMount() {
    const parsedContacts = JSON.parse(localStorage.getItem('contacts'));
    if (parsedContacts) {
      this.setState({ contacts: parsedContacts });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.contacts !== prevState.contacts) {
      localStorage.setItem('contacts', JSON.stringify(this.state.contacts));
    }
  }

  render() {
    const { filter } = this.state;
    const visibleContacts = this.getVisibleContacts();
    return (
      <div className="App">
        <h1>Phonebook</h1>
        <Container>
          <Section title="Add contact:">
            <ContactForm onFormSubmit={this.onFormSubmit} />
          </Section>
        </Container>
        <Container>
          <Section>
            <Filter value={filter} onFilterChange={this.onFilterChange} />
          </Section>
        </Container>
        <Container>
          <Section title="Contacts">
            <ContactList
              contacts={visibleContacts}
              onDeleteContact={this.onDeleteContact}
            />
          </Section>
        </Container>
      </div>
    );
  }
}

App.propTypes = {
  contacts: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      number: PropTypes.string.isRequired,
    }),
  ),
  filter: PropTypes.string,
};

export default App;
